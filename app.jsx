// @flow
/**
 * Editable content area for rich text formatting that converts the formatted
 * text into a JSON representation of the text.
 */
import * as React from "react";
import ContentEditable from "react-contenteditable";
import JSONPretty from "react-json-pretty";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";

import Colors from "./constants/colors";
import Spacing from "./constants/spacing";

const checkStyling = (style) => {
  let styleObject = {};
  let isItalic;
  let isBold;

  if (style) {
    //this splits the style string into an array, looks for font-weight attribute and value and saves that key and value to an object
    style.split(";").forEach((attributeAndValue) => {
      const attribute = attributeAndValue.split(":")[0].trim();
      let value = attributeAndValue.split(":")[1];

      if (attribute === "font-weight") {
        styleObject["fontWeight"] = value;
      }
      if (attribute === "font-style") {
        styleObject["fontStyle"] = value.trim();
      }
    });

    isItalic = styleObject.fontStyle === "italic";
    isBold = styleObject.fontWeight > 400 || styleObject.fontWeight === "bold";
  }

  return { isItalic, isBold };
};

const parseNodes = (nodes, baseStyle = "normal") => {
  console.log("nodes", nodes);
  let parsed = [];
  for (const node of nodes) {
    const { attribs, children, data, name, parent } = node;
    if (!name) {
      parsed = parsed.concat({
        style: baseStyle,
        content: data,
      });
    } else if (name === "b" || name === "strong") {
      //check if strong and IF it is not styled
      parsed = parsed.concat(
        parseNodes(children, baseStyle === "italic" ? "bold-italic" : "bold")
      );
    } else if (name === "i" || name === "em") {
      parsed = parsed.concat(
        parseNodes(children, baseStyle === "bold" ? "bold-italic" : "italic")
      );
    } else if (name) {
      const { style } = attribs;

      const { isItalic, isBold } = checkStyling(style);

      if (isItalic && !isBold) {
        parsed = parsed.concat(parseNodes(children, "italic"));
      } else if (!isItalic && isBold) {
        parsed = parsed.concat(parseNodes(children, "bold"));
      } else if (isItalic && isBold) {
        parsed = parsed.concat(parseNodes(children, "bold-italic"));
      } else {
        parsed = parsed.concat(parseNodes(children, "normal"));
      }
    }
  }
  return parsed;
};

const parseHtml = (html) =>
  ReactHtmlParser(html, {
    transform: (node, i) => {
      const { children, name, parent } = node;
      if (!parent && name) {
        const parsed = parseNodes(children);
        return parsed.length > 0
          ? {
              content: parsed,
            }
          : null;
      } else {
        return null;
      }
    },
  }).filter((node) => !!node);

const App = () => {
  const [html, setHtml] = React.useState("<div>Edit text here.</div>");
  console.log(html);
  const [parsed, setParsed] = React.useState(parseHtml(html));

  const handleChange = (e) => {
    console.log(e.target.value.search("<div>"));
    if (e.target.value.search("<div>") === 0) {
      setHtml(e.target.value);
      return;
    }
    setHtml(`<div>${e.target.value}</div>`);
    // setHtml(e.target.value);
  };

  React.useEffect(() => {
    const parsedHtml = parseHtml(html);
    setParsed(parsedHtml);
  }, [html]);

  return (
    <Wrapper>
      <ContentEditable
        html={html}
        onChange={handleChange}
        style={{
          flex: 1,
          maxWidth: "50vw",
          fontSize: "17px",
          fontFamily: "sans-serif",
          fontWeight: 300,
          lineHeight: "24px",
          height: "100vh",
          borderRight: `1px solid ${Colors.offBlack}`,
          padding: `${Spacing.small}px`,
        }}
      ></ContentEditable>
      <Strut size={24} />
      <JSONPretty
        data={parsed}
        style={{
          flex: 1,
          overflowX: "scroll",
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
`;

const Strut = styled.div`
  flex-basis: ${(props) => props.size}px;
`;

export default App;
