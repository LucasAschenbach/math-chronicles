#!/usr/bin/env node
/*
  Simple content validation for timeline.json
  - Ensures array of items
  - Validates required fields and types
  - Validates optional image object and file existence
*/

import fs from "node:fs";
import path from "node:path";

function fail(msg) {
  console.error(`\n❌ Content validation failed: ${msg}`);
  process.exit(1);
}

function warn(msg) {
  console.warn(`\n⚠️  ${msg}`);
}

function main() {
  const contentPath = path.join(process.cwd(), "content", "timeline.json");
  if (!fs.existsSync(contentPath)) {
    fail(`Missing content file at ${contentPath}`);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(contentPath, "utf8"));
  } catch (e) {
    fail(`Invalid JSON: ${e.message}`);
  }

  if (!Array.isArray(data)) {
    fail("timeline.json must export a JSON array of items");
  }

  const requiredKeys = ["year", "title", "blurb"]; // details and image are optional
  const errors = [];

  data.forEach((it, idx) => {
    const where = `item[${idx}]`;
    if (typeof it !== "object" || it === null || Array.isArray(it)) {
      errors.push(`${where} must be an object`);
      return;
    }

    for (const k of requiredKeys) {
      if (!(k in it)) errors.push(`${where} missing required field '${k}'`);
      else if (typeof it[k] !== "string") errors.push(`${where}.${k} must be a string`);
    }

    if ("details" in it && typeof it.details !== "string") {
      errors.push(`${where}.details must be a string if present`);
    }

    if ("image" in it && it.image !== undefined) {
      const img = it.image;
      if (typeof img !== "object" || img === null || Array.isArray(img)) {
        errors.push(`${where}.image must be an object if present`);
      } else {
        if (!("src" in img) || typeof img.src !== "string") {
          errors.push(`${where}.image.src is required and must be a string`);
        } else if (!img.src.startsWith("/")) {
          errors.push(`${where}.image.src should be a root-relative path like '/images/...'`);
        } else {
          // Check existence under public/
          const rel = img.src.replace(/^\//, "");
          const full = path.join(process.cwd(), "public", rel);
          if (!fs.existsSync(full)) {
            warn(`${where}.image.src points to missing file: public/${rel}`);
          }
        }
        if ("alt" in img && img.alt !== undefined && typeof img.alt !== "string") {
          errors.push(`${where}.image.alt must be a string if present`);
        }
        if ("caption" in img && img.caption !== undefined && typeof img.caption !== "string") {
          errors.push(`${where}.image.caption must be a string if present`);
        }
      }
    }
  });

  if (errors.length) {
    console.error("\nFound the following issues:\n- " + errors.join("\n- "));
    process.exit(1);
  }

  console.log("\n✅ Content validation passed (" + data.length + " items)");
}

main();

