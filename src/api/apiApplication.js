import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, jobData) {
  const supabase = await supabaseClient(token);

   const random = Math.floor(Math.random() * 90000);
   const applicantName = jobData?.name || jobData?.candidate_name || jobData?.candidate_id;
   const fileName = `resume-${random}-${applicantName}`;
   const {error:storageError}= await supabase.storage
   .from("resumes")
   .upload(fileName, jobData.resume);

   if (storageError) {
   console.error("Error Uploading Resume:", storageError);
    return null;
   }

   const resume=`${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

    const { data, error } = await supabase.from("applications").insert([
        {
        ...jobData,
        resume,
    }
])
.select();

    if (error) {
    console.error("Error Submitting Application:", error);
    return null;
  }
  return data;
}
export async function updateApplicationStatus(token, { application_id }, status) {
   const supabase = await supabaseClient(token);

    if (!application_id) {
      console.error("Error Updating Application Status: missing application_id");
      return null;
    }

    if (!status) {
      console.error("Error Updating Application Status: missing status");
      return null;
    }

    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", application_id)
      .select();

    if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }
  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}