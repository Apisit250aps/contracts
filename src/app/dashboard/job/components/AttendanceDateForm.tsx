"use client";

import { useState } from "react";

export default function AttendanceDateForm({
  onSubmit,
}: {
  onSubmit(date: Date): Promise<boolean>;
}) {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]); // เริ่มต้นด้วยรูปแบบ 'YYYY-MM-DD'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(new Date(date));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Date Attendance</span>
        </div>
        <input
          type="date"
          name="date"
          className="input input-bordered w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)} // ใช้ e.target.value โดยตรง
        />
      </label>
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}
