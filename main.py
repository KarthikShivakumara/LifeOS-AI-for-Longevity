# main.py — LifeOS Multi-Agent Health Council
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from supabase import create_client
import os, json, uuid
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# CONFIG
# ---------------------------
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

groq = Groq(api_key=GROQ_API_KEY)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------------------
# MODELS
# ---------------------------
class UserData(BaseModel):
    sleep: float
    steps: int
    screen_time: float
    stress: str
    feeling: str = ""
    user_id: str = ""

class UserProfile(BaseModel):
    full_name: str
    age: int
    height: float
    weight: float

class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str
    age: int
    height: float
    weight: float

class LoginRequest(BaseModel):
    email: str
    password: str



# ---------------------------
# GROQ AGENT HELPER
# ---------------------------
def call_groq(system: str, temperature: float = 0.6) -> dict:
    """Calls Groq Llama 3.3 with a system prompt and returns parsed JSON."""
    res = groq.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "system", "content": system}],
        response_format={"type": "json_object"},
        temperature=temperature
    )
    return json.loads(res.choices[0].message.content)

# ---------------------------
# MULTI-AGENT COUNCIL
# ---------------------------
def run_council(sleep: float, steps: int, screen_time: float, stress: str, feeling: str, age: int = 30, height: float = 170, weight: float = 70, name: str = "User"):
    """
    Three-Phase Sequential Agentic Pipeline:
    1. PERCEPTION AGENT  → reads raw data + feeling
    2. DIAGNOSTIC AGENT  → calculates score + bio-age from perception
    3. PROGNOSTIC AGENT  → calculates risk + protocols from diagnosis
    """
    print(f"\n╔═══ [LifeOS Council] Analyzing {name} ═══╗")
    print(f"   Sleep={sleep}h | Steps={steps} | Screen={screen_time}h | Stress={stress}")
    print(f"   Feeling: {feeling[:60] if feeling else 'Not provided'}...")

    # ── AGENT 1: PERCEPTION ──────────────────────────────────
    perception_prompt = f"""
    You are the PERCEPTION AGENT of the LifeOS Health Council.
    Your job: Create a "Biological State Summary" by interpreting the user's metrics and feeling.
    Detect mismatches (e.g. good sleep but high fatigue = hidden stressor).
    
    INPUT:
    - Age: {age}, Height: {height}cm, Weight: {weight}kg
    - Sleep: {sleep}h, Steps: {steps}, Screen Time: {screen_time}h, Stress: {stress}
    - Feeling: "{feeling or 'Not provided'}"
    
    OUTPUT ONLY JSON:
    {{
      "state_summary": "2-3 sentence clinical biological state.",
      "key_stressors": ["stressor1", "stressor2"],
      "hidden_mismatch": true | false,
      "mismatch_note": "Explanation of any mismatch found between feeling and metrics."
    }}
    """
    try:
        perception = call_groq(perception_prompt, temperature=0.5)
        print(f"   [Agent 1: Perception] State: {perception.get('state_summary','')[:70]}...")
    except Exception as e:
        print(f"   [Agent 1 Error] {e}")
        perception = {"state_summary": "Unable to assess.", "key_stressors": [], "hidden_mismatch": False, "mismatch_note": ""}

    # ── AGENT 2: DIAGNOSTIC ──────────────────────────────────
    diagnostic_prompt = f"""
    You are the DIAGNOSTIC AGENT of the LifeOS Health Council.
    You receive the Perception Agent's report and raw metrics. Calculate a precise Health Score and Biological Age.
    
    SCORING RULES (STRICT):
    - Score range: 0-100. DO NOT default to 70-75.
    - Sleep < 5h: cap score at 50. Sleep 7-9h: bonus +10 pts.
    - Steps < 3000: cap score at 60.
    - Stress=High: -15 pts, bio-age +5 to +10 years older.
    - Stress=Low + steps > 8000 + sleep >= 8: score >= 85.
    - Screen > 8h: -10 pts.
    - A "Hidden Mismatch" (feeling worse than metrics suggest) should decrease score by 5-15.
    - Analyze individual metric impact, not a generic average.
    
    PERCEPTION REPORT:
    {json.dumps(perception)}
    
    RAW METRICS:
    Sleep={sleep}h, Steps={steps}, Screen={screen_time}h, Stress={stress}, Chronological Age={age}
    
    OUTPUT ONLY JSON:
    {{
      "health_score": number (0-100, NO safe middles),
      "biological_age": number,
      "score_reasoning": "Explain what drove this score."
    }}
    """
    try:
        diagnostic = call_groq(diagnostic_prompt, temperature=0.4)
        print(f"   [Agent 2: Diagnostic] Score={diagnostic.get('health_score')} BioAge={diagnostic.get('biological_age')} | {diagnostic.get('score_reasoning','')[:60]}...")
    except Exception as e:
        print(f"   [Agent 2 Error] {e}")
        # Dynamic local calculation as fallback
        s = min(sleep, 10) / 10 * 35
        st = min(steps, 12000) / 12000 * 30
        sc = -(screen_time / 18) * 15
        sr = {"Low": 0, "Medium": -8, "High": -18}.get(stress, -8)
        score = max(20, min(98, int(s + st + sc + sr + 30)))
        bio = age + {"Low": -1, "Medium": 2, "High": 7}.get(stress, 0)
        diagnostic = {"health_score": score, "biological_age": bio, "score_reasoning": "Local calculation."}

    # ── AGENT 3: PROGNOSTIC ──────────────────────────────────
    prognostic_prompt = f"""
    You are the PROGNOSTIC AGENT of the LifeOS Health Council.
    Given the perception state and diagnosis, predict risk and generate precision protocols.
    
    DIAGNOSTIC SUMMARY:
    {json.dumps(diagnostic)}
    KEY STRESSORS: {json.dumps(perception.get('key_stressors', []))}
    
    OUTPUT ONLY JSON:
    {{
      "risk": {{
        "level": "Low" | "Medium" | "High",
        "score": number (0-100)
      }},
      "future": {{
        "risk_percentage": number (0-100),
        "trend": "Improving" | "Stable" | "Declining",
        "5_year": "Low" | "Moderate" | "High",
        "10_year": "Low" | "Moderate" | "High"
      }},
      "feedback": {{
        "positives": ["specific positive finding 1", "specific positive finding 2"],
        "improvements": ["specific high-impact protocol 1", "specific high-impact protocol 2"]
      }}
    }}
    """
    try:
        prognostic = call_groq(prognostic_prompt, temperature=0.7)
        print(f"   [Agent 3: Prognostic] Risk={prognostic['risk']['level']} | Trend={prognostic['future']['trend']}")
    except Exception as e:
        print(f"   [Agent 3 Error] {e}")
        score = diagnostic.get("health_score", 70)
        prognostic = {
            "risk": {"level": "Medium" if score < 70 else "Low", "score": 100 - score},
            "future": {"risk_percentage": 100 - score, "trend": "Stable", "5_year": "Moderate", "10_year": "Moderate"},
            "feedback": {"positives": ["System Online"], "improvements": ["Check connection"]}
        }

    print(f"╚═══ [Council Complete] ═══╝\n")

    return {
        "health_score": diagnostic.get("health_score", 70),
        "biological_age": diagnostic.get("biological_age", age),
        "risk": prognostic.get("risk"),
        "future": prognostic.get("future"),
        "feedback": prognostic.get("feedback")
    }

# ---------------------------
# ENDPOINTS
# ---------------------------

@app.get("/")
def root():
    return {"status": "LifeOS Multi-Agent Council Online 🏛️"}

@app.post("/create-profile")
def create_profile(profile: UserProfile):
    try:
        res = supabase.table("users").insert({
            "full_name": profile.full_name,
            "age": profile.age,
            "height": profile.height,
            "weight": profile.weight
        }).execute()
        return res.data
    except Exception as e:
        print(f"[DB] Profile insert error: {e}")
        return [{"id": str(uuid.uuid4()), "full_name": profile.full_name, "age": profile.age, "height": profile.height, "weight": profile.weight}]

@app.post("/signup")
def signup(req: SignupRequest):
    """Create Supabase Auth user + insert profile into users table."""
    try:
        # 1. Register with Supabase Auth
        auth_res = supabase.auth.sign_up({
            "email": req.email,
            "password": req.password
        })
        user = auth_res.user
        if not user:
            return {"error": "Signup failed. Email may already be registered."}

        user_id = user.id

        # 2. Insert profile using the Auth user UUID
        try:
            supabase.table("users").insert({
                "id": user_id,
                "full_name": req.full_name,
                "age": req.age,
                "height": req.height,
                "weight": req.weight
            }).execute()
        except Exception as db_err:
            print(f"[DB] Profile insert after signup error: {db_err}")

        session = auth_res.session
        print(f"[Auth] New user: {req.email} ({user_id})")
        return {
            "id": user_id,
            "email": req.email,
            "full_name": req.full_name,
            "age": req.age,
            "height": req.height,
            "weight": req.weight,
            "access_token": session.access_token if session else None
        }
    except Exception as e:
        print(f"[Auth] Signup error: {e}")
        return {"error": str(e)}

@app.post("/login")
def login(req: LoginRequest):
    """Sign in with Supabase Auth and return profile + session."""
    try:
        auth_res = supabase.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password
        })
        user = auth_res.user
        session = auth_res.session
        if not user:
            return {"error": "Invalid email or password."}

        user_id = user.id

        # Fetch profile from users table
        profile = None
        try:
            prof_res = supabase.table("users").select("*").eq("id", user_id).single().execute()
            profile = prof_res.data
        except:
            pass

        print(f"[Auth] Login: {req.email} ({user_id})")
        return {
            "id": user_id,
            "email": req.email,
            "full_name": profile.get("full_name", "") if profile else "",
            "age": profile.get("age", 30) if profile else 30,
            "height": profile.get("height", 170) if profile else 170,
            "weight": profile.get("weight", 70) if profile else 70,
            "access_token": session.access_token if session else None
        }
    except Exception as e:
        print(f"[Auth] Login error: {e}")
        return {"error": str(e)}

@app.post("/agent-structured")
def run_agent(data: UserData):
    user_id = data.user_id

    # Fetch profile from Supabase for enriched analysis
    age, height, weight, name = 30, 170, 70, "User"
    try:
        uuid.UUID(user_id)
        prof = supabase.table("users").select("*").eq("id", user_id).single().execute()
        if prof.data:
            age = prof.data.get("age", 30)
            height = prof.data.get("height", 170)
            weight = prof.data.get("weight", 70)
            name = prof.data.get("full_name", "User")
    except:
        pass

    # Run the 3-agent council
    analysis = run_council(
        sleep=data.sleep, steps=data.steps,
        screen_time=data.screen_time, stress=data.stress,
        feeling=data.feeling, age=age, height=height, weight=weight, name=name
    )

    # Persist to Supabase
    record = {
        "user_id": user_id,
        "sleep": data.sleep,
        "steps": data.steps,
        "screen_time": data.screen_time,
        "stress": data.stress,
        "feeling": data.feeling,
        "score": analysis["health_score"],
        "biological_age": analysis["biological_age"],
        "risk": analysis["risk"],
        "future": analysis["future"],
        "positives": analysis["feedback"]["positives"],
        "improvements": analysis["feedback"]["improvements"]
    }
    try:
        uuid.UUID(user_id)
        supabase.table("health_records").insert(record).execute()
        print(f"[DB] Record saved for user {user_id}")
    except Exception as e:
        print(f"[DB] Save error: {e}")

    return {
        **analysis,
        "label": "Optimal" if analysis["health_score"] >= 80 else "Moderate" if analysis["health_score"] >= 60 else "Poor"
    }

@app.get("/user-history/{user_id}")
def get_history(user_id: str):
    try:
        uuid.UUID(user_id)
    except ValueError:
        return []
    try:
        res = supabase.table("health_records").select("*").eq("user_id", user_id).order("created_at").execute()
        return res.data or []
    except Exception as e:
        print(f"[DB] History fetch error: {e}")
        return []