import { resetServerContext } from "react-beautiful-dnd";
import { useContext } from "react";
import * as APIService from "../../services/apis"
import nookies from 'nookies'

import InboxPage from "../../components/inboxPage/index";

const IndexPage = ({ 
  pageIdList, 
  filteredPages, 
  data,
  err }) => {
  return <InboxPage 
            pageIdList={pageIdList} 
            filteredPages={filteredPages} 
            userData={data} 
            err={err} />;
};

export const getServerSideProps = async (context) => {
  const myCookies = nookies.get(context)
  const { token } = myCookies;

  console.log("COOKIE:", myCookies);

  resetServerContext(); // needed for drag and drop functionality
  const uid = context.query.uid;
  try {
    const res = await APIService.GetUserAccount(uid, token);

    const data = await res.json();
    const pageIdList = data.pages;
    if ( !pageIdList){
      return { 
        props: { 
          blocks: null, 
          uid: null, 
          creatorid: null, 
          err: true 
        } 
      };
    }
    const pages = await Promise.all(
      pageIdList.map(async (id) => {
        const response = await APIService.PageInfo(id, token, "GET")
        return await response.json();
      })
    );
    const filteredPages = pages.filter((page) => !page.errCode);
    return {
      props: { 
        filteredPages: filteredPages, 
        pageIdList: pageIdList, 
        data: data,
        err: false 
      },
    };
  } catch (err) {
    console.log("[uid]/index ERROR: ", err);
    return { 
      props: { 
        blocks: null, 
        uid: null, 
        creatorid: null, 
        err: true 
      } 
    };
  }
};

export default IndexPage;
