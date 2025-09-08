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

  const requiredKeys = ["id", "year", "title", "blurb"]; // details and image are optional
  const errors = [];
  const ids = new Set();

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

    // id uniqueness
    if (typeof it.id === "string") {
      if (ids.has(it.id)) errors.push(`${where}.id '${it.id}' is duplicated`);
      ids.add(it.id);
    }

    if ("details" in it && typeof it.details !== "string") {
      errors.push(`${where}.details must be a string if present`);
    }

    if ("era" in it && it.era !== undefined && typeof it.era !== "string") {
      errors.push(`${where}.era must be a string if present`);
    }

    if ("domains" in it && it.domains !== undefined) {
      if (!Array.isArray(it.domains)) errors.push(`${where}.domains must be an array of strings`);
      else if (it.domains.some((d) => typeof d !== "string")) errors.push(`${where}.domains must contain only strings`);
    }

    if ("tags" in it && it.tags !== undefined) {
      if (!Array.isArray(it.tags)) errors.push(`${where}.tags must be an array of strings`);
      else if (it.tags.some((d) => typeof d !== "string")) errors.push(`${where}.tags must contain only strings`);
    }

    if ("people" in it && it.people !== undefined) {
      if (!Array.isArray(it.people)) errors.push(`${where}.people must be an array of objects`);
      else {
        it.people.forEach((p, j) => {
          const pWhere = `${where}.people[${j}]`;
          if (typeof p !== "object" || p === null || Array.isArray(p)) {
            errors.push(`${pWhere} must be an object`);
            return;
          }
          if (!("name" in p) || typeof p.name !== "string") errors.push(`${pWhere}.name is required and must be a string`);
          if ("link" in p && p.link !== undefined && typeof p.link !== "string") errors.push(`${pWhere}.link must be a string if present`);
          if ("role" in p && p.role !== undefined && typeof p.role !== "string") errors.push(`${pWhere}.role must be a string if present`);
        });
      }
    }

    if ("seeAlso" in it && it.seeAlso !== undefined) {
      if (!Array.isArray(it.seeAlso)) errors.push(`${where}.seeAlso must be an array of strings`);
      else if (it.seeAlso.some((s) => typeof s !== "string")) errors.push(`${where}.seeAlso must contain only strings`);
    }

    if ("sources" in it && it.sources !== undefined) {
      if (!Array.isArray(it.sources)) errors.push(`${where}.sources must be an array of objects`);
      else {
        it.sources.forEach((s, j) => {
          const sWhere = `${where}.sources[${j}]`;
          if (typeof s !== "object" || s === null || Array.isArray(s)) {
            errors.push(`${sWhere} must be an object`);
            return;
          }
          if (!("url" in s) || typeof s.url !== "string") errors.push(`${sWhere}.url is required and must be a string`);
          if ("label" in s && s.label !== undefined && typeof s.label !== "string") errors.push(`${sWhere}.label must be a string if present`);
        });
      }
    }

    if ("endYear" in it && it.endYear !== undefined && typeof it.endYear !== "string") {
      errors.push(`${where}.endYear must be a string if present`);
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

  // Validate cross-references in seeAlso
  const itemsById = new Map();
  data.forEach((it) => {
    if (typeof it.id === "string") itemsById.set(it.id, it);
  });
  data.forEach((it, idx) => {
    const where = `item[${idx}]`;
    if (Array.isArray(it.seeAlso)) {
      it.seeAlso.forEach((id) => {
        if (!itemsById.has(id)) warn(`${where}.seeAlso references missing id '${id}'`);
      });
    }
  });

  if (errors.length) {
    console.error("\nFound the following issues:\n- " + errors.join("\n- "));
    process.exit(1);
  }

  console.log("\n✅ Content validation passed (" + data.length + " items)");
}

main();
