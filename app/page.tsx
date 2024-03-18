import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = createClient();
  let { data: jobs, error } = await supabase.from("jobs").select("*");

  return (
    <div>
      <nav>
        <div>
          <AuthButton />
        </div>
      </nav>
    </div>
  );
}
