import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

import styles from "./page.module.css";
import AuthButton from "@/components/AuthButton";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SubmitButton } from "@/app/login/submit-button";


const signIn = async (formData: FormData) => {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/protected");
};

const signUp = async (formData: FormData) => {
  "use server";

  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/login?message=Check email to continue sign in process");
};

export default async function Page({ params }: { params: { slug: string[] } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [link, title, id] = params?.slug;

  if (id) {
    const decodedId = decodeURIComponent(id);
    const { data: job, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", decodedId);

    if (job) {
      return <div>Job: {JSON.stringify(job)}</div>;
    }

    if (error) {
      return <div>Something went wrong</div>;
    }
  } else {
    const decodedLink = decodeURIComponent(link);
    const decodedtitle = decodeURIComponent(title);

    return (
      <div className="h-100% bg-slate-400">
        <div className={styles.container}>
          <div className={styles.job}>
            <Link href={decodedLink} prefetch={false}>
              {decodedtitle}
            </Link>
          </div>

          {user ? (
            <div>
              <button >Comment</button>
            </div>
          ) : (
            <div>
              <p>Sign up or Log In to leave a comment</p>
              <form>
                <label className="text-md" htmlFor="email">
                  Email
                </label>
                <input name="email" placeholder="you@example.com" required />
                <label className="text-md" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
                <SubmitButton formAction={signIn} pendingText="Signing In...">
                  Sign In
                </SubmitButton>
                <SubmitButton formAction={signUp} pendingText="Signing Up...">
                  Sign Up
                </SubmitButton>
              </form>
            </div>
          )}

          <div className={styles.comments}></div>
        </div>
      </div>
    );
  }
}
