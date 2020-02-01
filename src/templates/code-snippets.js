import React from "react";
import { graphql, Link } from "gatsby";
import { parser } from "../utils/parser";
import { SnippetAnimator } from "../components/SnippetAnimator";
export default function Template({ data }) {
  const links = data.allMarkdownRemark.edges.map(edge => {
    return {
      name: edge.node.frontmatter.linkname,
      path: edge.node.frontmatter.path,
      category: edge.node.frontmatter.category
    };
  });
  const multilevelLinks = Object.entries(
    links.reduce((acc, link) => {
      if (!acc[link.category]) acc[link.category] = [];
      acc[link.category].push(link);
      return acc;
    }, {})
  );
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const snippets = parser(html);
  return (
    <>
      <div>
        <ul>
          {multilevelLinks.map(links => {
            return (
              <li>
                {links[0]}
                <ul>
                  {links[1].map(link => {
                    return (
                      <li key={link.path}>
                        <Link to={link.path}>{link.name}</Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="snippet-container">
        <div className="snippet">
          <h1>How {frontmatter.title} works</h1>
          <SnippetAnimator snippets={snippets} />
        </div>
      </div>
    </>
  );
}
export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___title], order: DESC }) {
      edges {
        node {
          frontmatter {
            linkname
            path
            category
          }
        }
      }
    }
  }
`;
