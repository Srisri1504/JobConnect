import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [authMode, setAuthMode] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [backendMessage, setBackendMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/test")
      .then((response) => response.json())
      .then((data) => {
        setBackendMessage(data.message);
      })
      .catch((error) => {
        console.error("Backend connection error:", error);
      });
  }, []);

  const jobs = [
    {
      role: "Frontend Developer",
      company: "TechNova",
      location: "Chennai",
      type: "Full Time",
      salary: "₹4-6 LPA",
      category: "Development",
      icon: "💻",
    },
    {
      role: "UI/UX Designer",
      company: "Creative Labs",
      location: "Bangalore",
      type: "Full Time",
      salary: "₹3-5 LPA",
      category: "Design",
      icon: "🎨",
    },
    {
      role: "Python Developer",
      company: "CodeCraft",
      location: "Hyderabad",
      type: "Remote",
      salary: "₹5-8 LPA",
      category: "Development",
      icon: "🐍",
    },
    {
      role: "Cyber Security Analyst",
      company: "SecureTech",
      location: "Chennai",
      type: "Full Time",
      salary: "₹4-7 LPA",
      category: "Security",
      icon: "🔐",
    },
    {
      role: "Digital Marketing Executive",
      company: "GrowthHub",
      location: "Mumbai",
      type: "Part Time",
      salary: "₹3-4 LPA",
      category: "Marketing",
      icon: "📈",
    },
    {
      role: "React Developer",
      company: "WebSolutions",
      location: "Remote",
      type: "Remote",
      salary: "₹6-9 LPA",
      category: "Development",
      icon: "⚛️",
    },
  ];

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (authMode === "signup" && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (authMode === "signup") {
      try {
        const response = await fetch("http://localhost:5001/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName,
            email: email,
            password: password,
            role: "jobseeker",
          }),
        });

        const responseText = await response.text();

        console.log("Status:", response.status);
        console.log("URL:", response.url);
        console.log("Response:", responseText);

        let data;

        try {
          data = JSON.parse(responseText);
        } catch (error) {
          alert("Server returned HTML instead of JSON. Check Console.");
          return;
        }

        if (!response.ok) {
          alert(data.message);
          return;
        }

        alert("Registration successful!");

        setAuthMode(null);
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } catch (error) {
        alert("Error: " + error.message);
        console.error(error);
      }
    } else {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Login successful! Welcome " + data.user.name);
      setLoggedInUser(data.user);

      setAuthMode(null);
      setEmail("");
      setPassword("");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = (job.role + job.company)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesLocation = job.location
      .toLowerCase()
      .includes(location.toLowerCase());
    const matchesCategory = category === "All" || job.category === category;
    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="app">
      <p>{backendMessage}</p>
      <header className="navbar">
        <div className="logo">
          Job<span>Connect</span>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#jobs">Find Jobs</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-buttons">
          <button
            className="login-btn"
            onClick={() => {
              console.log("LOGIN CLICKED");
              setAuthMode("login");
            }}
          >
            Login
          </button>

          <button className="signup-btn" onClick={() => setAuthMode("signup")}>
            Sign Up
          </button>
          {loggedInUser && (
            <button
              className="login-btn"
              onClick={() => {
                fetch(
                  `/api/my-applications?email=${encodeURIComponent(loggedInUser.email)}`,
                )
                  .then((response) => response.json())
                  .then((data) => {
                    setMyApplications(data);
                    setAuthMode("applications");
                  })
                  .catch((error) => alert("Error: " + error.message));
              }}
            >
              My Applications
            </button>
          )}

          {loggedInUser && (
            <button
              className="login-btn"
              onClick={() => {
                setLoggedInUser(null);
                setMyApplications([]);
                setAuthMode(null);
                alert("Logged out successfully!");
              }}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="tagline">✦ YOUR CAREER JOURNEY STARTS HERE</p>

          <h1>
            Find Your <span>Dream Job</span>
            <br />
            Build Your Future.
          </h1>

          <p className="hero-description">
            Discover thousands of opportunities from top companies. Your next
            career move starts with one search.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Job title or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              onClick={() =>
                document
                  .getElementById("jobs")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Search Jobs →
            </button>
          </div>

          <p className="popular">
            Popular: Developer · Designer · Marketing · Security
          </p>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-icon">💼</div>
            <h3>Find Opportunities</h3>
            <p>Your future begins today.</p>
            <div className="visual-bottom">
              <span>✦ Career growth</span>
              <span>✦ New beginnings</span>
            </div>
          </div>
          <div className="floating-card">🚀 Start your career!</div>
        </div>
      </section>

      <section className="stats">
        <div>
          <h2>10K+</h2>
          <p>Active Jobs</p>
        </div>
        <div>
          <h2>5K+</h2>
          <p>Companies</p>
        </div>
        <div>
          <h2>25K+</h2>
          <p>Job Seekers</p>
        </div>
        <div>
          <h2>8K+</h2>
          <p>Successful Hires</p>
        </div>
      </section>

      <section className="categories section" id="categories">
        <div className="section-heading">
          <p className="small-heading">EXPLORE OPPORTUNITIES</p>
          <h2>
            Browse by <span>Category</span>
          </h2>
          <p>Find the right role in your favorite industry.</p>
        </div>

        <div className="category-grid">
          {[
            ["💻", "Development", "120+ Jobs"],
            ["🎨", "Design", "85+ Jobs"],
            ["🔐", "Security", "60+ Jobs"],
            ["📈", "Marketing", "95+ Jobs"],
          ].map((item) => (
            <div
              className="category-card"
              key={item[1]}
              onClick={() => {
                setCategory(item[1]);
                document
                  .getElementById("jobs")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="category-icon">{item[0]}</div>
              <h3>{item[1]}</h3>
              <p>{item[2]}</p>
              <span>Explore Jobs →</span>
            </div>
          ))}
        </div>
      </section>

      <section className="jobs-section section" id="jobs">
        <div className="section-heading">
          <p className="small-heading">CAREER OPPORTUNITIES</p>
          <h2>
            Featured <span>Jobs</span>
          </h2>
          <p>Explore the latest opportunities waiting for you.</p>
        </div>

        <div className="filter-bar">
          {["All", "Development", "Design", "Security", "Marketing"].map(
            (item) => (
              <button
                key={item}
                className={category === item ? "filter active" : "filter"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <div className="job-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <div className="job-card" key={index}>
                <div className="job-top">
                  <div className="company-icon">{job.icon}</div>
                  <span className="job-type">{job.type}</span>
                </div>
                <h3>{job.role}</h3>
                <p className="company-name">{job.company}</p>
                <div className="job-details">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                </div>
                <button
                  className="apply-btn"
                  onClick={async () => {
                    if (!loggedInUser) {
                      alert("Please login before applying!");
                      setAuthMode("login");
                      return;
                    }

                    try {
                      const response = await fetch("/api/apply", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          applicantName: loggedInUser.name,
                          email: loggedInUser.email,
                          jobRole: job.role,
                          company: job.company,
                          location: job.location,
                        }),
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        alert(data.message);
                        return;
                      }

                      alert("Application submitted successfully!");
                    } catch (error) {
                      alert("Application failed: " + error.message);
                    }
                  }}
                >
                  Apply Now →
                </button>
              </div>
            ))
          ) : (
            <p className="no-jobs">No jobs found. Try another search.</p>
          )}
        </div>

        <button
          className="view-all"
          onClick={() => {
            setSearch("");
            setLocation("");
            setCategory("All");
          }}
        >
          Reset Filters
        </button>
      </section>

      <section className="cta" id="about">
        <div>
          <p className="small-heading">TAKE THE NEXT STEP</p>
          <h2>
            Your Dream Career
            <br />
            Is Just One Click Away.
          </h2>
          <p>
            Create your profile and discover opportunities that match your
            skills.
          </p>
          <button onClick={() => setAuthMode("signup")}>Get Started →</button>
        </div>
        <div className="cta-icon">🚀</div>
      </section>

      <footer>
        <div className="logo">
          Job<span>Connect</span>
        </div>
        <p>Connecting talent with opportunities.</p>
        <p className="copyright">© 2026 JobConnect. All rights reserved.</p>
      </footer>

      {authMode === "applications" && (
        <div className="auth-overlay">
          <div className="auth-box">
            <button className="auth-close" onClick={() => setAuthMode(null)}>
              ×
            </button>

            <h2>My Applications</h2>

            {myApplications.length === 0 ? (
              <p>You haven't applied for any jobs yet.</p>
            ) : (
              myApplications.map((app, index) => (
                <div key={index}>
                  <h3>{app.jobRole}</h3>
                  <p>{app.company}</p>
                  <p>{app.location}</p>
                  <p>
                    Status:{" "}
                    <span className="application-status">
                      {app.status || "Pending"}
                    </span>
                  </p>
                  <p>
                    Applied At: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                  <hr />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {(authMode === "login" || authMode === "signup") && (
        <div className="auth-overlay">
          <div className="auth-box">
            <button className="auth-close" onClick={() => setAuthMode(null)}>
              ×
            </button>

            <div className="logo">
              Job<span>Connect</span>
            </div>

            <h2>{authMode === "login" ? "Welcome Back!" : "Create Account"}</h2>

            <p>
              {authMode === "login"
                ? "Login to continue your career journey."
                : "Join JobConnect and find your dream job."}
            </p>

            <form onSubmit={handleAuthSubmit}>
              {authMode === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />

              {authMode === "signup" && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              <button type="submit" className="auth-submit">
                {authMode === "login" ? "Login" : "Create Account"}
              </button>
            </form>

            <p className="auth-switch">
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <span
                onClick={() =>
                  setAuthMode(authMode === "login" ? "signup" : "login")
                }
              >
                {authMode === "login" ? " Sign Up" : " Login"}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
