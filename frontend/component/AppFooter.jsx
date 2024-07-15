'use client'
import { Email, GitHub, Instagram, LinkedIn } from "@mui/icons-material";
import { Footer, Label, Textarea } from "flowbite-react";

export default function AppFooter() {
  return <div>
    <div className="bottom-0 w-full">
      <Footer container>
        <div className="w-full text-center">
          {/* <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <Footer.Brand
                src="./blog logo white.png"
                alt="Blog App Logo"
                className="w-full h-14"
              /> */}
          <Footer.LinkGroup className="justify-center">
            <Footer.Link className="ms-6" href="https://github.com/amaan7355" target="blank"><GitHub /></Footer.Link>
            <Footer.Link className="ms-6" href="https://www.linkedin.com/in/amaan-alam-86b821241?original_referer=https%3A%2F%2Famaan7355.github.io%2F" target="blank"><LinkedIn /></Footer.Link>
            <Footer.Link className="ms-6" href="mailto:alamamaan334@gmail.com" ><Email /></Footer.Link>
            <Footer.Link className="ms-6" href="https://www.instagram.com/iamaanalam/" target="blank"><Instagram /></Footer.Link>
          </Footer.LinkGroup>
          {/* </div> */}
          <Footer.Divider />
          <Footer.Copyright by="Amaan Alam™" year={2024} />
        </div>
      </Footer>
      {/* <Footer container>
          <Footer.LinkGroup>
          <Footer.Link href="https://github.com/amaan7355" target="blank"><GitHub className="me-3"/></Footer.Link>
                <Footer.Link href="https://www.linkedin.com/in/amaan-alam-86b821241?original_referer=https%3A%2F%2Famaan7355.github.io%2F" target="blank"><LinkedIn className="me-3"/></Footer.Link>
                <Footer.Link href="mailto:alamamaan334@gmail.com" ><Email className="me-3"/></Footer.Link>
                <Footer.Link href="https://www.instagram.com/iamaanalam/" target="blank"><Instagram/></Footer.Link>
          </Footer.LinkGroup>
          <Footer.Copyright href="" by="Amaan Alam™" year={2024} />
        </Footer> */}
    </div>
  </div>
}