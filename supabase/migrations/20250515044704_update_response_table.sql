drop policy "Responses can be updated by their creators" on "public"."responses";

create policy "Responses can be updated by their creators"
on "public"."responses"
as permissive
for update
to public
using ((auth.uid() IS NOT NULL));



