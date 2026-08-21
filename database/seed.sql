USE clientflow;

INSERT INTO users (name, email, password_hash) VALUES
('Demo User', 'demo@clientflow.test', '$2y$10$5kHlSRouI5kTudpCQNKEP.lIAa.JYRGalCQolnfENMaIVpLqTE5CC');

INSERT INTO clients (user_id, client_name, company_name, email, phone, project_service, status, notes) VALUES
(1, 'Sarah Mitchell', 'Northstar Creative', 'sarah@northstarcreative.com', '+1 (415) 777-0144', 'Website Redesign', 'Active', 'Needs new landing pages and conversion audit.'),
(1, 'Daniel Brooks', 'Apex Digital', 'daniel@apexdigital.io', '+1 (212) 233-5567', 'E-Commerce Development', 'Lead', 'Initial discovery call completed.'),
(1, 'Emma Carter', 'BrightPath Consulting', 'emma@brightpathco.com', '+1 (310) 448-8233', 'Landing Page Development', 'On Hold', 'Waiting on brand assets from client.'),
(1, 'Michael Reyes', 'Horizon Media', 'michael@horizonmedia.com', '+1 (702) 565-1678', 'CRM Integration', 'Active', 'Marketing automation integration is underway.'),
(1, 'Olivia Chen', 'Vertex Solutions', 'olivia@vertexsolutions.com', '+1 (617) 440-1902', 'SEO Website Improvements', 'Completed', 'Final QA approved and launch complete.'),
(1, 'Marcus Lee', 'Summit Labs', 'marcus@summitlabs.io', '+1 (512) 456-3090', 'Client Portal', 'Lead', 'Budget pending approval.'),
(1, 'Priya Shah', 'Harbor Studio', 'priya@harborstudio.co', '+1 (206) 189-1176', 'Marketing Dashboard', 'Active', 'Dashboard wireframes approved.'),
(1, 'Alex Morgan', 'Luma Partners', 'alex@lumapartners.com', '+1 (646) 213-5904', 'Analytics Reporting', 'On Hold', 'Awaiting stakeholder feedback.'),
(1, 'Nina Patel', 'Bluepeak Agency', 'nina@bluepeakagency.com', '+1 (408) 515-9934', 'Conversion Optimization', 'Active', 'Conversion testing is in progress.'),
(1, 'Thomas Walker', 'Redwood Group', 'thomas@redwoodgroup.com', '+1 (303) 332-7715', 'Brand Refresh', 'Completed', 'Brand system delivered and signed off.');

INSERT INTO tasks (client_id, title, description, status, priority, due_date) VALUES
(1, 'Homepage wireframes', 'Create homepage concepts for new design direction.', 'Completed', 'High', DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(1, 'SEO content review', 'Audit content for search performance improvements.', 'In Progress', 'Medium', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
(1, 'Client sign-off meeting', 'Prepare presentation and stakeholder notes.', 'To Do', 'High', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'Discovery workshop', 'Run kickoff workshop and gather requirements.', 'Completed', 'High', DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
(2, 'Payment flow review', 'Review cart and check-out flows for improvements.', 'In Progress', 'Medium', DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(2, 'Technical stack recommendation', 'Document the recommendation for platform integration.', 'To Do', 'Low', DATE_ADD(CURDATE(), INTERVAL 9 DAY)),
(3, 'Asset collection', 'Request final files from the client.', 'To Do', 'High', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(3, 'Design update', 'Update hero section after asset approval.', 'In Progress', 'Medium', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
(4, 'CRM setup', 'Create the contact and workflow setup for CRM.', 'In Progress', 'High', DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
(4, 'Lead automation', 'Build lead capture automation and trigger rules.', 'Completed', 'Medium', DATE_SUB(CURDATE(), INTERVAL 6 DAY)),
(4, 'Testing checklist', 'Review automation results and fix failed steps.', 'To Do', 'High', DATE_ADD(CURDATE(), INTERVAL 6 DAY)),
(5, 'SEO migration', 'Complete migration and redirect mapping.', 'Completed', 'High', DATE_SUB(CURDATE(), INTERVAL 12 DAY)),
(5, 'Analytics dashboard', 'Final validation for reporting dashboard update.', 'Completed', 'Low', DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(6, 'Portal requirements', 'Draft the portal requirements and feature list.', 'To Do', 'Medium', DATE_ADD(CURDATE(), INTERVAL 8 DAY)),
(6, 'Stakeholder review', 'Prepare review notes for internal meeting.', 'In Progress', 'High', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
(7, 'Dashboard wireframes', 'Review and refine wireframes for marketing dashboard.', 'Completed', 'High', DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(7, 'Data source mapping', 'Document the reporting sources and metrics.', 'In Progress', 'Medium', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
(8, 'Status update', 'Compile stakeholder feedback and next steps.', 'To Do', 'Low', DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(8, 'Prototype review', 'Check prototype against the expected flow.', 'In Progress', 'Medium', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(9, 'Test variation A', 'Prepare the A/B variation for landing page optimization.', 'In Progress', 'High', DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
(9, 'Performance scoring', 'Review current performance and identify wins.', 'Completed', 'Medium', DATE_SUB(CURDATE(), INTERVAL 9 DAY)),
(10, 'Brand guidelines', 'Finalize brand voice and typography direction.', 'Completed', 'High', DATE_SUB(CURDATE(), INTERVAL 11 DAY)),
(10, 'Launch assets', 'Package the final asset kit for client delivery.', 'Completed', 'Low', DATE_SUB(CURDATE(), INTERVAL 2 DAY));
