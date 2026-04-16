import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function getCompanies(token) {
   const supabase = await supabaseClient(token);

    
    
    const { data, error } = await supabase.from("companies").select("*");

    if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  }
  return data;
}

export async function addNewCompany(token,_,companyData) {
   const supabase = await supabaseClient(token);

   if (!companyData?.name) {
    throw new Error("Company name is required");
  }

  if (!companyData?.logo) {
    throw new Error("Company logo is required");
  }

   const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) {
    throw new Error(storageError.message || "Error uploading Company Logo");
  }

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

    
    
    const { data, error } = await supabase.from("companies")
    .insert([{
      name:companyData.name,
      logo_url,
    }])
    .select();

    if (error) throw new Error(error.message || "Error creating company");
  return data;
}