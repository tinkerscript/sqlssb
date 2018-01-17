USE sqlssb;

CREATE MESSAGE TYPE [//sqlssb/demo_message];

CREATE CONTRACT [//sqlssb/demo_contract] (
  [//sqlssb/demo_message] SENT BY ANY
);

CREATE QUEUE sqlssb_demo_queue_1;
CREATE QUEUE sqlssb_demo_queue_2;

CREATE SERVICE [//sqlssb/demo_service_1]
  ON QUEUE sqlssb_demo_queue_1 ([//sqlssb/demo_contract]);

CREATE SERVICE [//sqlssb/demo_service_2]
  ON QUEUE sqlssb_demo_queue_2 ([//sqlssb/demo_contract]);

GO
