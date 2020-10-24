import { resetServerContext } from "react-beautiful-dnd";
import nookies from 'nookies'
import * as APIService from "../../services/apis"
import ReadingListsPage from "../../components/readingListsPage/index";

const RListPage = ({ pageIdList, filteredPages, permanentPages, data, blocks, err }) => {
  return <ReadingListsPage 
            pageIdList={pageIdList} 
            filteredPages={filteredPages} 
            permanentPages={permanentPages} 
            fetchedBlocks={blocks} 
            userData={data} 
            err={err} />;
};

export const getServerSideProps = async (context) => {
  const myCookies = nookies.get(context)
  const { token } = myCookies;
  
  resetServerContext(); // needed for drag and drop functionality
  const uId = context.query.uid;
  try {

    const response = await APIService.GetUserAccount(uId,token)
    const data = await response.json();
    const pageIdList = data.pages;
    const permanentPagesList = data.permanentPages;

    const pages = await Promise.all(
      pageIdList.map(async (id) => {
        const response = await APIService.PageInfo(id, token, "GET")
        return await response.json();
      })
    );

    const permanentPages = await Promise.all(
      permanentPagesList.map(async (id) => {
        const response = await APIService.PageInfo(id, token, "GET")
        return await response.json();
      })
    );

    const filteredPages = pages.filter((page) => !page.errCode);
    return {
      props: { permanentPages: permanentPages, filteredPages: filteredPages, pageIdList: pageIdList, data: data, err: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, uid: null, creatorid: null, err: true } };
  }
};

export default RListPage;
