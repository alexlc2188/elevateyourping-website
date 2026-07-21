import Cookies from "./cookies.mdx";
import { BlogBreadcrumb } from "../blog/_components/breadcrumb";

const CookiesPage = () => {
  return (
    <div id="blog-page" className="bg-[#f9f9f9] px-4 md:px-6 mx-auto py-8">
      <article className="bg-white max-w-4xl lg:max-w-5xl mx-auto rounded-xl shadow-sm p-6 prose prose-headings:font-sans prose-headings:mt-8 prose-p:leading-relaxed prose-img:rounded-lg prose-img:my-6">
        <div className="not-prose">
          <BlogBreadcrumb />
        </div>
        <Cookies />
      </article>
    </div>
  );
};

export default CookiesPage;
