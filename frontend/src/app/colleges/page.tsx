import { COLLEGES, College, formatFees } from "./data";

export type { College };
export { formatFees };

export interface CollegesResponse {
  colleges: College[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getColleges(params: Record<string, string> = {}): Promise<CollegesResponse> {
  const { search, location, min_fees, max_fees, course, page = "1", limit = "9" } = params;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  let filtered = [...COLLEGES];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
  }
  if (location) {
    filtered = filtered.filter(c => c.state === location);
  }
  if (min_fees) {
    filtered = filtered.filter(c => c.fees_per_year >= parseInt(min_fees));
  }
  if (max_fees) {
    filtered = filtered.filter(c => c.fees_per_year <= parseInt(max_fees));
  }
  if (course) {
    filtered = filtered.filter(c => c.courses.includes(course));
  }

  filtered.sort((a, b) => b.rating - a.rating);

  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum);
  const start = (pageNum - 1) * limitNum;
  const colleges = filtered.slice(start, start + limitNum);

  return { colleges, total, page: pageNum, totalPages };
}

export async function getCollege(id: string): Promise<College> {
  const college = COLLEGES.find(c => c.id === parseInt(id));
  if (!college) throw new Error("College not found");
  return college;
}

export async function compareColleges(ids: number[]): Promise<College[]> {
  return COLLEGES.filter(c => ids.includes(c.id));
}

export async function getStates(): Promise<string[]> {
  const states = COLLEGES.map(c => c.state);
  const unique = states.filter((s, i) => states.indexOf(s) === i);
  return unique.sort();
}