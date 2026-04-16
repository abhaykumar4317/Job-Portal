import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { addNewCompany } from '@/api/apiCompanies';
import useFetch from '@/hooks/use.fetch';
import { BarLoader } from 'react-spinners';

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) => {
        const uploadedFile = file?.[0];
        return (
          !!uploadedFile &&
          (uploadedFile.type === "image/png" ||
            uploadedFile.type === "image/jpeg")
        );
      },
      {
        message: "Only Images are allowed",
      }
    ),
});
const AddCompanyDrawer = ({ fetchCompanies }) => {
     const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = async (formData) => {
    try {
      await fnAddCompany({}, {
        ...formData,
        logo: formData.logo?.[0],
      });
    } catch {
      
    }
  };

  const onDrawerFormSubmit = (e) => {
    
    e.preventDefault();
    e.stopPropagation();
    return handleSubmit(onSubmit)(e);
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) fetchCompanies?.();
  }, [dataAddCompany, fetchCompanies]);
  return (
    <Drawer>
  <DrawerTrigger asChild>
    <Button type="button" size="sm" variant="secondary">
      Add Company
    </Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Add a New Company</DrawerTitle>
      </DrawerHeader>
      <form className="flex gap-2 p-4 pb-0" onSubmit={onDrawerFormSubmit}>
         <Input placeholder="Company name" {...register("name")} />
          <Input
            type="file"
            accept="image/*"
            className=" file:text-gray-500"
            {...register("logo")}
          />
           <Button
            type="submit"
            disabled={loadingAddCompany}
            variant="destructive"
            className="w-40"
          >
            Add
          </Button>
      </form>
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
       {errorAddCompany?.message && (
            <p className="text-red-500">{errorAddCompany?.message}</p>
      )}
       {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}
    <DrawerFooter>
      
      <DrawerClose asChild>
        <Button variant="secondary" type="button">
          Cancel
        </Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  )
}

export default AddCompanyDrawer
