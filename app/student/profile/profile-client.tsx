"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileClient({ student }: { student: any }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <Card className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-medium">Full Name</label>
            {isEditing ? (
              <Input defaultValue={student.name} />
            ) : (
              <p>{student.name}</p>
            )}
          </div>

          <div>
            <label className="font-medium">Email</label>
            {isEditing ? (
              <Input defaultValue={student.email} />
            ) : (
              <p>{student.email}</p>
            )}
          </div>

          <div>
            <label className="font-medium">Roll</label>
            {isEditing ? (
              <Input defaultValue={student.roll} />
            ) : (
              <p>{student.roll}</p>
            )}
          </div>

          <div>
            <label className="font-medium">Department</label>
            <p>{student.departmentName}</p>
          </div>

          <div>
            <label className="font-medium">Batch</label>
            {isEditing ? (
              <Input defaultValue={student.batch} />
            ) : (
              <p>{student.batch}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4 border-t">
            <Button>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
