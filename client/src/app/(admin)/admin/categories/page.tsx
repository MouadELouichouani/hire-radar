'use client'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/dataTable'
import { getCategories, getSkills } from '@/services/shared'
import { Button } from '@/components/ui/button'

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Category name" },
]

const page = () => {
  const [categories,setCategories] = useState<Category[]>([])
  const [loading,setLoading] = useState(true)

  const fetchCategories = async () =>{
    try{
      const res = await getCategories()
      if(res.status === 200){
        setCategories(res.data)
      }
    }catch{

    }finally{
      setLoading(false)
    }
  }

  const handleDelete = (categoryId: number) =>{    
    setCategories(prev => prev.filter(c => c.id !== categoryId)) 
  }

  useEffect(() =>{
    fetchCategories()
  },[])

  if(loading) return null
  return (  
    <div>
      <h1 className='text-xl font-semibold'>Categories list</h1>
      <DataTable
        data={categories}
        content={'category'} 
        columns={columns} 
        showMenu={false}
        actions={[
        { label: "Delete", onClick: (userId: number) => handleDelete(userId), variant: "destructive" },
        { label: "Edit", onClick: (userId: number) => handleDelete(userId), variant: "destructive" },
      ]} />
    </div>
  )
}

export default page
