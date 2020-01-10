import PaginationStyles from './styles/PaginationStyles'
import {useQuery,gql} from '@apollo/client'
import {perPage} from '../config'
import Head from 'next/head'
import Link from 'next/link'
const PAGINATION_QUERY=gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`;

const Pagination=props=>{
    const {data,error,loading}=useQuery(PAGINATION_QUERY)
    let count,pages,page;
    if(!loading){
        count=data.itemsConnection.aggregate.count
        pages=Math.ceil(count/perPage)
        page=props.page
    }
    return (<PaginationStyles>
       
            <Link prefetch href={{pathname:'items',query:{page:page-1}}}><a className="prev" aria-disabled={page <= 1}>← Prev</a></Link>
        {
        loading?<p>loading</p>:<><p>Page {props.page} of {pages}</p><p>{count} Items Total</p></>}
         <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page/1 + 1 },
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next →
            </a>
          </Link>
    </PaginationStyles>)



}
export default Pagination