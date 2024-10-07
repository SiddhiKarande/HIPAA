# HIPAA
HIPAA Learning Portal
# Overview
The HIPAA Learning Portal is a web-based application designed to facilitate compliance training for employees in healthcare organizations, ensuring that all staff members are educated on the Health Insurance Portability and Accountability Act (HIPAA). The platform enables administrators to nominate employees for courses, while also providing employees with the ability to self-enroll, complete training, and obtain certifications. The system supports role-based access, email notifications, and course progress tracking.

# Features
User Authentication: Secure user authentication with OAuth2, powered by Passport.js, ensuring that only authorized users can access the platform.
Admin Dashboard: Administrators can manage courses, nominate employees, track progress, and issue certificates upon course completion.
Self-Enrollment: Employees can browse available courses and self-enroll to complete their required compliance training.
Automated Notifications: Integrated with NodeMailer to send email notifications for enrollment confirmation, course deadlines, and certification issuance.
Course Management: Efficient management of course modules, including videos, quizzes, and other training materials.
Certificate Management: Automated generation of certificates upon course completion, with secure storage and retrieval.
# Tech Stack
Frontend: Built with React for a responsive, dynamic user experience.
Backend: Developed using Node.js and TypeScript for a robust and scalable server architecture.
Authentication: Implemented OAuth2 authentication using Passport.js.
Database: MongoDB used for storing user data, course details, and training records.
Email Service: NodeMailer integrated for email notifications regarding enrollment and certifications.
APIs: RESTful APIs for managing user authentication, course nomination, enrollment, and certificate management.
# Installation
Clone the repository:
git clone https://github.com/SiddhiKarande/hipaa-learning-portal.git
cd hipaa-learning-portal
Install dependencies:
npm install
Configure environment variables in a .env file for database connection, OAuth2 credentials, and email service.
Run the application:
npm start
# Usage
Admin Access: Use the admin credentials to log into the dashboard and manage training modules, assign courses, and monitor progress.
Employee Access: Employees can sign in, enroll in courses, complete training, and download their certificates.