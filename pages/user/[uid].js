import { resetServerContext } from "react-beautiful-dnd";
import nookies from 'nookies'
import * as APIService from "../../services/apis";
import ProfilePage from "../../components/readingListsPage/index";

const IndexPage = ({ uid, pageIdList, filteredPages, creatorid, blocks, err }) => {
  return <ProfilePage id={uid} pageIdList={pageIdList} filteredPages={filteredPages} creatorid={creatorid} fetchedBlocks={blocks} err={err} />;
};

export const getServerSideProps = async (context) => {
  resetServerContext(); // needed for drag and drop functionality
  const myCookies = nookies.get(context)
  const { token } = myCookies;

  const pageId = context.query.uid;
  try {

    const response = await APIService.UserAccount(
      token, "GET" 
    )
    const data = await response.json();
    const pageIdList = data.pages;

    const pages = await Promise.all(
      pageIdList.map(async (id) => {
        const response = await APIService.PageInfo(
          id, token, "GET"
        )
        return await response.json();
      })
    );
    const filteredPages = pages.filter((page) => !page.errCode);
    return {
      props: { filteredPages: filteredPages, pageIdList: pageIdList, uid: pageId, creatorid: data.name, err: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, uid: null, creatorid: null, err: true } };
  }
};

export default IndexPage;
