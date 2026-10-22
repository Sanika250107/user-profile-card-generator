
const express = require("express");
const path = require("path");
const db = require("./database/database");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Check server and database
app.get("/api/health", (req, res) => {
  res.json({
    message: "User Profile Card Generator server is running!",
    database: "connected"
  });
});

// Validate social media URLs
function validateSocialUrl(value, allowedHosts) {
  if (!value) return "";

  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);

    if (!["https:", "http:"].includes(url.protocol)) return null;
    if (!allowedHosts.includes(url.hostname.toLowerCase())) return null;

    return url.href;
  } catch {
    return null;
  }
}

function prepareProfile(body) {
  const { name, bio, skills, github, linkedin } = body;

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Name is required." };
  }

  if (name.trim().length > 100) {
    return { error: "Name must be 100 characters or fewer." };
  }

  if (typeof bio !== "string" || bio.length > 500) {
    return { error: "Bio must be 500 characters or fewer." };
  }

  if (typeof skills !== "string" || skills.length > 500) {
    return { error: "Skills must be 500 characters or fewer." };
  }

  const safeGithub = validateSocialUrl(github, [
    "github.com",
    "www.github.com"
  ]);

  const safeLinkedin = validateSocialUrl(linkedin, [
    "linkedin.com",
    "www.linkedin.com"
  ]);

  if (safeGithub === null || safeLinkedin === null) {
    return { error: "Enter valid GitHub and LinkedIn URLs." };
  }

  return {
    profile: {
      name: name.trim(),
      bio: bio.trim(),
      skills: skills.trim(),
      github: safeGithub,
      linkedin: safeLinkedin
    }
  };
}

// Create a new profile
app.post("/api/profiles", (req, res) => {
  const result = prepareProfile(req.body);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const { name, bio, skills, github, linkedin } = result.profile;

    const saved = db.prepare(`
      INSERT INTO profiles (name, bio, skills, github, linkedin)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, bio, skills, github, linkedin);

    res.status(201).json({
      message: "Profile saved successfully!",
      id: saved.lastInsertRowid
    });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Could not save the profile." });
  }
});

// Get all saved profiles
app.get("/api/profiles", (req, res) => {
  try {
    const profiles = db.prepare(
      "SELECT * FROM profiles ORDER BY id DESC"
    ).all();

    res.json(profiles);
  } catch (error) {
    console.error("Read error:", error);
    res.status(500).json({ error: "Could not load profiles." });
  }
});

// Update an existing profile
app.put("/api/profiles/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid profile ID." });
  }

  const result = prepareProfile(req.body);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const { name, bio, skills, github, linkedin } = result.profile;

    const updated = db.prepare(`
      UPDATE profiles
      SET name = ?, bio = ?, skills = ?, github = ?, linkedin = ?
      WHERE id = ?
    `).run(name, bio, skills, github, linkedin, id);

    if (updated.changes === 0) {
      return res.status(404).json({ error: "Profile not found." });
    }

    res.json({
      message: "Profile updated successfully!",
      id
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Could not update the profile." });
  }
});

// Delete an existing profile
app.delete("/api/profiles/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid profile ID." });
  }

  try {
    const deleted = db.prepare(
      "DELETE FROM profiles WHERE id = ?"
    ).run(id);

    if (deleted.changes === 0) {
      return res.status(404).json({ error: "Profile not found." });
    }

    res.json({
      message: "Profile deleted successfully!",
      id
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Could not delete the profile." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("SQLite database connected.");
});
