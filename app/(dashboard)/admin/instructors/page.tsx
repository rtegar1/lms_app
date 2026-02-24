import { getInstructors } from "@/lib/actions/instructor-actions";
import InstructorTable from "./_components/instructor-table";

export const revalidate = 0;

export default async function DataInstructorPage() {
  const instructors = await getInstructors();

  return (
    <div className="p-6">
      <InstructorTable data={instructors} />
    </div>
  );
}