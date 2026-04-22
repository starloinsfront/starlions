import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

// Импортируем стили, чтобы классы заработали
import "./typography.css"

const MetaTypography: Meta = {
  title: "Styles/Typography",
}

export default MetaTypography

const longText = "Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH"

export const AllStyles: StoryObj = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "20px",
        backgroundColor: "var(--dark-700)",
        color: "var(--light-100)",
        maxWidth: "350px",
      }}
    >
      <h2 style={{ borderBottom: "1px solid #444", paddingBottom: "10px", color: "#808080" }}>
        Design System Typography
      </h2>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          .large (26px, Semi-Bold, LH 36px)
        </div>
        <div className="large">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          H1 (20px, Bold, LH 36px)
        </div>
        <div className="h1">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          H2 (18px, Bold, LH 30px)
        </div>
        <div className="h2">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          H3 (16px, Semi-Bold, LH 24px)
        </div>
        <div className="h3">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          .regularText16 (16px, Regular, LH 24px)
        </div>
        <div className="regularText16">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          .boldText16 (16px, Bold, LH 24px)
        </div>
        <div className="boldText16">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          .regularText14 (14px, Regular, LH 24px)
        </div>
        <div className="regularText14">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          .mediumText14 (14px, Medium, LH 24px)
        </div>
        <div className="mediumText14">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          .boldText14 (14px, Bold, LH 24px)
        </div>
        <div className="boldText14">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          .smallText (12px, Regular, LH 16px)
        </div>
        <div className="smallText">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          .semiBoldSmallText (12px, Semi-Bold, LH 16px)
        </div>
        <div className="semiBoldSmallText">{longText}</div>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          .regularLink (14px, Underline)
        </div>
        <a className="regularLink">{longText}</a>
      </section>

      <section>
        <div style={{ color: "#808080", fontSize: "14px", marginBottom: "4px" }}>
          .smallLink (12px, Underline)
        </div>
        <a className="smallLink">{longText}</a>
      </section>
    </div>
  ),
}
