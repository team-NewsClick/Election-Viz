import Header from '../components/article/Header'
import Footer from '../components/article/Footer'
import IntroductionThumbnail from '../components/article/IntroductionThumbnail'
import AnchorLinks from '../components/article/AnchorLinks'
import CategoryPublishingDate from '../components/article/CategoryPublishingDate'
import ArticleTitle from '../components/article/ArticleTitle'
import FeatureImage from '../components/article/FeatureImage'

const Article = () => {
  return (
    <div className="grid grid-cols-12 justify-self-center">
      <title>Election Interactive Data Visualisation</title>
      <div className="col-span-2 sm:inline-block hidden"></div>
      <div className="col-span-12 mx-5 md:col-span-8 sm:mx-0">
        <Header />
        <div className="article my-12">
          <CategoryPublishingDate />
          <ArticleTitle />
          <FeatureImage />
          <AnchorLinks />
          <IntroductionThumbnail />
        </div>
        {/* <RelatedPosts /> */}
        <Footer />
      </div>
      <div className="col-span-2 hidden sm:inline-block"></div>
    </div>
  )
}

export default Article
