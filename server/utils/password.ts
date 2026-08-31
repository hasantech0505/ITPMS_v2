import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password is required for hashing");
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;

  const cleanPass = password.trim();
  const cleanHash = hash.trim();

  // Must be a valid bcrypt hash string starting with $2a$, $2b$, or $2y$
  if (!cleanHash.startsWith("$2a$") && !cleanHash.startsWith("$2b$") && !cleanHash.startsWith("$2y$")) {
    return false;
  }

  try {
    return await bcrypt.compare(cleanPass, cleanHash);
  } catch {
    return false;
  }
}


