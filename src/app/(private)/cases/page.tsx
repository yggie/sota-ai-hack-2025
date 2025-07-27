import Link from "next/link";

export default function CasesPage() {
  return (
    <div className="p-4">
      <h1>All cases</h1>

      <Link href="/cases/new" className="btn btn-primary">
        New case
      </Link>
    </div>
  );
}
