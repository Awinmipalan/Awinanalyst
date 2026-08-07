import assert from "node:assert/strict";
import { profileDataset } from "../src/utils/dataProfiler";

const rows = [
  { region: "North", sales: "1,000", profit: 100, active: true, date: "2026-01-01" },
  { region: "North", sales: "1,200", profit: 120, active: true, date: "2026-01-02" },
  { region: "South", sales: "900", profit: 90, active: false, date: "2026-01-03" },
  { region: "South", sales: "900", profit: 90, active: false, date: "2026-01-03" },
  { region: "East", sales: "", profit: null, active: true, date: "2026-01-04" },
];

const profile = profileDataset(rows, ["region", "sales", "profit", "active", "date", "empty_col"]);

assert.equal(profile.rowCount, 5);
assert.equal(profile.columnCount, 6);
assert.equal(profile.duplicateRows, 1);

const sales = profile.columns.find(column => column.name === "sales");
assert.ok(sales);
assert.equal(sales.type, "numeric");
assert.equal(sales.missing, 1);
assert.equal(sales.numeric?.count, 4);
assert.equal(sales.numeric?.missing, 1);
assert.equal(sales.numeric?.median, 950);

const region = profile.columns.find(column => column.name === "region");
assert.ok(region);
assert.equal(region.type, "categorical");
assert.deepEqual(region.topValues?.[0], { value: "North", count: 2 });

const date = profile.columns.find(column => column.name === "date");
assert.ok(date);
assert.equal(date.type, "date");

const empty = profile.columns.find(column => column.name === "empty_col");
assert.ok(empty);
assert.equal(empty.type, "empty");
assert.equal(empty.missingRate, 1);

assert.ok(
  profile.correlations.some(correlation =>
    correlation.columnA === "sales" &&
    correlation.columnB === "profit" &&
    correlation.coefficient > 0.99
  ),
  "expected strong sales/profit correlation to be reported"
);

console.log("dataProfiler analytical validation passed");
