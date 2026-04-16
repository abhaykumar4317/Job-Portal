import { getCompanies } from '@/api/apiCompanies';
import { getJobs } from '@/api/apijobs'
import JobCard from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use.fetch'
import { useUser } from '@clerk/clerk-react';
import { State } from 'country-state-city';
import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';


const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("ALL");
  const [company_id, setCompany_id] = useState("ALL");
  const [hiringStatus, setHiringStatus] = useState("ALL");
  const { isLoaded } = useUser();
  
 const {
  fn:fnJobs,
  data:Jobs,
  loading:loadingJobs,
 } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
   isOpen: hiringStatus,
 });

  const {fn:fnCompanies,data:companies} = useFetch(getCompanies);
  const companiesList = companies ?? [];

 useEffect(()=>{
   if(isLoaded) fnCompanies();
 }, [isLoaded]);

 useEffect(()=>{
   if(isLoaded) fnJobs();
 }, [isLoaded,location,company_id,searchQuery,hiringStatus]);

 const handleSearch = (e) => {
  e.preventDefault();
  let formData= new FormData(e.target);


  const query = formData.get("search-query");
  if(query) setSearchQuery(query);
  
 };

 const clearFilters = ()=>{
  setSearchQuery("");
  setLocation("ALL");
  setCompany_id("ALL");
  setHiringStatus("ALL");

 };

if(!isLoaded){
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
   }

  return (<div>
     <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>
      Latest Jobs
      </h1>

      {/* {Add filters here } */}
       <form onSubmit={handleSearch}
        className='h-14 flex w-full gap-2 items-center mb-3'>
        <Input type="text"
         placeholder="search Jobs by Title.."
          name="search-query" 
          className="h-full flex-1 px-4 text-md" 
          />
         <Button type="submit" className='h-full sm:w-28' variant={"blue"}>
          Search
          </Button>

       </form>

       <div className='flex flex-col sm:flex-row gap-2'>
      <Select value={location} onValueChange={(value)=>setLocation(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by Location" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="ALL">All locations</SelectItem>
          {State.getStatesOfCountry("IN").map(({ name }) => {
            return (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>

    <Select value={company_id} onValueChange={(value)=>setCompany_id(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by Company" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="ALL">All companies</SelectItem>
          {companiesList.length ? (
            companiesList.map(({ name,id }) => {
              return (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              );
            })
          ) : (
            <SelectItem value="NONE" disabled>No companies available</SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>

    <Select value={hiringStatus} onValueChange={(value)=>setHiringStatus(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by Hiring Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="ALL">All status</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <Button onClick={clearFilters} variant="destructive" className="sm:w-1/2">
    Clear Filters
    </Button>
       </div>

      {loadingJobs && (
        <BarLoader className='mt-4' width={"100%"} color='#36d7b7' />
        )}

      {loadingJobs===false && (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Jobs?.length ?(
            Jobs.map((job)=>{
              return <JobCard 
              key={job.id} 
              job={job} 
              savedInit={job?.saved?.length > 0}
              />
            })
          ):(
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}

    </div>
  )
}

export default JobListing;
