-- Insert Scrum Team Template
insert into health_check_templates (
    id,
    name,
    description,
    type,
    team_id,
    min_value,
    max_value,
    questions,
    is_custom,
    created_at
) values (
    gen_random_uuid(),
    'Scrum Team Health Check',
    'Comprehensive health check template for Scrum teams focusing on sprint delivery and team health',
    'scrum',
    null,
    1,
    10,
    jsonb_build_array(
        -- Section 1: Delivery Metrics
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Sprint Goal Confidence',
            'section', 'Delivery & Execution',
            'description', 'Did we achieve the goal, which includes the most valuable deliverables or outcome expected?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Sprint Completion  % / Work Progress',
            'section', 'Delivery & Execution',
            'description', 'How much of the planned sprint backlog was actually completed? (>8: 90%+ completed, 6-8: 60-90% completed, <6: Less than 60% completed)'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Long-Term Alignment',
            'section', 'Delivery & Execution',
            'description', 'Are we tracking & progressing toward the project milestone or next major delivery?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Story Clarity & Acceptance Criteria',
            'section', 'Delivery & Execution',
            'description', 'Were all tasks/user stories clear and well-defined before starting?'
        ),
        -- Section 2: Team & Process Health
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Collaboration & Communication',
            'section', 'Team Collaboration',
            'description', 'How well did the team communicate and collaborate (internally & with stakeholders)?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Team Ownership & Accountability',
            'section', 'Team Collaboration',
            'description', 'Did the team take full ownership of their work and drive tasks to completion?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Quality Standards Compliance',
            'section', 'Team Collaboration',
            'description', 'Did we meet expected quality standards, including code quality, testing, and adherence to best practices?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Process Efficiency & Team Morale',
            'section', 'Team Collaboration',
            'description', 'Was the workflow smooth and enjoyable for the team?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Lessons Learned and Challenges',
            'section', 'Additional Questions',
            'description', 'What were the top 3 challenges or surprises this sprint, and what did we learn from each?'
        )
    ),
    false,
    now()
);

-- Insert Kanban/Hybrid Team Template
insert into health_check_templates (
    id,
    name,
    description,
    type,
    team_id,
    min_value,
    max_value,
    questions,
    is_custom,
    created_at
) values (
    gen_random_uuid(),
    'Kanban/Hybrid Team Health Check',
    'Comprehensive health check template for Kanban and Hybrid teams focusing on flow-based delivery and team health',
    'kanban',
    null,
    1,
    10,
    jsonb_build_array(
        -- Section 1: Delivery Metrics
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Work Flow Efficiency',
            'section', 'Delivery & Execution',
            'description', 'Are we finishing work items based on priorities instead of pushing in new tasks randomly?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Work Progress',
            'section', 'Delivery & Execution',
            'description', 'Is work progressing smoothly without too many stuck items?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Long-Term Alignment',
            'section', 'Delivery & Execution',
            'description', 'Do we have a healthy balance of new work vs. clearing old tasks?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Work Item Clarity',
            'section', 'Delivery & Execution',
            'description', 'Are work items well-defined and structured before being worked on?'
        ),
        -- Section 2: Team & Process Health
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Collaboration & Communication',
            'section', 'Team Collaboration',
            'description', 'How well did the team communicate and collaborate (internally & with stakeholders)?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Team Ownership & Accountability',
            'section', 'Team Collaboration',
            'description', 'Did the team take full ownership of their work and drive tasks to completion?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Quality Standards Compliance',
            'section', 'Team Collaboration',
            'description', 'Did we meet expected quality standards, including code quality, testing, and adherence to best practices?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Process Efficiency & Team Morale',
            'section', 'Team Collaboration',
            'description', 'Was the workflow smooth and enjoyable for the team?'
        ),
        jsonb_build_object(
            'id', gen_random_uuid(),
            'title', 'Lessons Learned and Challenges',
            'section', 'Additional Questions',
            'description', 'What were the top 3 challenges or surprises this period, and what did we learn from each?'
        )
    ),
    false,
    now()
);