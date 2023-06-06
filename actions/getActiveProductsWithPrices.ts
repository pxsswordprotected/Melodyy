import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { ProductWithPrice } from "@/types";

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => { //Song is defined in types.ts
    const supabase = createServerComponentClient({ //server component supabase client
        cookies: cookies
    });  

    const { data, error } =await supabase //fetching our songs
    .from('products')
    .select('*, prices(*)') //everything inside using *
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

    if (error) {
        console.log(error);
    }

    return (data as any) || [];
};

export default getActiveProductsWithPrices;