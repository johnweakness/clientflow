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
(1, 'Homepage wireframes', 'Create homepage concepts for new design direction.', 'Completed', 'High', CURRENT_DATE - INTERVAL '4 days'),
(1, 'SEO content review', 'Audit content for search performance improvements.', 'In Progress', 'Medium', CURRENT_DATE + INTERVAL '2 days'),
(1, 'Client sign-off meeting', 'Prepare presentation and stakeholder notes.', 'To Do', 'High', CURRENT_DATE + INTERVAL '5 days'),
(2, 'Discovery workshop', 'Run kickoff workshop and gather requirements.', 'Completed', 'High', CURRENT_DATE - INTERVAL '7 days'),
(2, 'Payment flow review', 'Review cart and check-out flows for improvements.', 'In Progress', 'Medium', CURRENT_DATE + INTERVAL '4 days'),
(2, 'Technical stack recommendation', 'Document the recommendation for platform integration.', 'To Do', 'Low', CURRENT_DATE + INTERVAL '9 days'),
(3, 'Asset collection', 'Request final files from the client.', 'To Do', 'High', CURRENT_DATE - INTERVAL '1 day'),
(3, 'Design update', 'Update hero section after asset approval.', 'In Progress', 'Medium', CURRENT_DATE + INTERVAL '3 days'),
(4, 'CRM setup', 'Create the contact and workflow setup for CRM.', 'In Progress', 'High', CURRENT_DATE + INTERVAL '1 day'),
(4, 'Lead automation', 'Build lead capture automation and trigger rules.', 'Completed', 'Medium', CURRENT_DATE - INTERVAL '6 days'),
(4, 'Testing checklist', 'Review automation results and fix failed steps.', 'To Do', 'High', CURRENT_DATE + INTERVAL '6 days'),
(5, 'SEO migration', 'Complete migration and redirect mapping.', 'Completed', 'High', CURRENT_DATE - INTERVAL '12 days'),
(5, 'Analytics dashboard', 'Final validation for reporting dashboard update.', 'Completed', 'Low', CURRENT_DATE - INTERVAL '2 days'),
(6, 'Portal requirements', 'Draft the portal requirements and feature list.', 'To Do', 'Medium', CURRENT_DATE + INTERVAL '8 days'),
(6, 'Stakeholder review', 'Prepare review notes for internal meeting.', 'In Progress', 'High', CURRENT_DATE + INTERVAL '2 days'),
(7, 'Dashboard wireframes', 'Review and refine wireframes for marketing dashboard.', 'Completed', 'High', CURRENT_DATE - INTERVAL '3 days'),
(7, 'Data source mapping', 'Document the reporting sources and metrics.', 'In Progress', 'Medium', CURRENT_DATE + INTERVAL '2 days'),
(8, 'Status update', 'Compile stakeholder feedback and next steps.', 'To Do', 'Low', CURRENT_DATE + INTERVAL '10 days'),
(8, 'Prototype review', 'Check prototype against the expected flow.', 'In Progress', 'Medium', CURRENT_DATE + INTERVAL '5 days'),
(9, 'Test variation A', 'Prepare the A/B variation for landing page optimization.', 'In Progress', 'High', CURRENT_DATE + INTERVAL '1 day'),
(9, 'Performance scoring', 'Review current performance and identify wins.', 'Completed', 'Medium', CURRENT_DATE - INTERVAL '9 days'),
(10, 'Brand guidelines', 'Finalize brand voice and typography direction.', 'Completed', 'High', CURRENT_DATE - INTERVAL '11 days'),
(10, 'Launch assets', 'Package the final asset kit for client delivery.', 'Completed', 'Low', CURRENT_DATE - INTERVAL '2 days');
