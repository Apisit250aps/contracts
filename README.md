# Job & Attendance Management System

A web application built with Next.js 15 for managing workers, jobs, and attendance tracking.

## Features

- Authentication using NextAuth.js (Credentials Provider)
- Job Management
  - Create, update and delete jobs
  - Assign workers to jobs
  - View job details and assigned workers
- Worker Management
  - Maintain worker profiles with contact information
  - Track worker assignments across jobs
- Attendance Tracking
  - Record daily attendance for workers by job
  - View attendance history and reports
  - Track attendance status with timestamps

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: Tailwind CSS, SweetAlert2

## Project Structure

```
├───app
│   ├───api
│   │   ├───auth
│   │   │   ├───signup
│   │   │   └───[...nextauth]
│   │   ├───job
│   │   │   └───[jobId]
│   │   │       ├───assign
│   │   │       └───attendance
│   │   │           └───[attendanceId]
│   │   └───worker
│   ├───auth
│   ├───dashboard
│   │   ├───job
│   │   │   └───components
│   │   └───worker
│   │       └───components
│   └───job
│       └───[id]
│           └───calculate
├───libs
│   ├───database
│   └───providers
├───models
├───services
├───shared
│   ├───components
│   │   ├───actions
│   │   ├───display
│   │   └───navigation
│   └───repository
└───types
```

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```env
MONGODB_URI=your_mongodb_uri
AUTH_SECRET=your_secret
```

4. Run development server:
```bash
npm run dev
```

## Data Models

### Job
```typescript
interface IJob {
  title: string;
  description: string;
  assignedWorkers: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Worker
```typescript
interface IWorker {
  name: string;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Attendance
```typescript
interface IAttendance {
  jobId: ObjectId;
  date: Date;
  records: {
    worker: ObjectId;
    status: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

This project is licensed under the MIT License.