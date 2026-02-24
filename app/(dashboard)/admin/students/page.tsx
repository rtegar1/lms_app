import { getStudents } from "@/lib/actions/student-actions";
import StudentTable from "./_components/student-table";

export const revalidate = 0;

export default async function DataSiswaPage() {
  const students = await getStudents();

  return (
    <div className="p-6">
      <StudentTable data={students} />
    </div>
  );
}