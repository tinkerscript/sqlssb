USE sqlssb;

DECLARE @DialogId UNIQUEIDENTIFIER;

BEGIN DIALOG @DialogId
FROM SERVICE [sqlssb_demo_service_2] TO SERVICE 'sqlssb_demo_service_1'
ON CONTRACT [//sqlssb/demo_contract] WITH ENCRYPTION=OFF; 

SEND ON CONVERSATION @DialogId
MESSAGE TYPE [//sqlssb/demo_message] ('hello, world!');

GO
