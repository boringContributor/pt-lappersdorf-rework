import { Box } from '@chakra-ui/react';
import { gql, request } from 'graphql-request';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { ContactInformation, ContactInformationProps } from "../components/contact-information";
import { PageHeaderImg } from "../components/page-header-img";
import { PageHeading } from "../components/page-heading";
import { PageMeta } from "../types/page-meta";

type ContactPage = ContactInformationProps & PageMeta

export const getStaticProps: GetStaticProps = async () => {
    const query = gql`
    query {
        contact(where: { slug: "contact"}) {
          address
          fax
          phone
          email
          description
          backgroundURL {
              url
          }
        }
      }
  `;

    const data = await request<{ contact: ContactPage }>(process.env.graphql as string, query);

    if (!data.contact) {
        return {
            notFound: true
        }
    }

    return {
        props: data,
        revalidate: 60 * 60 // Enables ISR -> Cache response for 1 hour (60 seconds * 60 minutes)
    };
};

const Contact: NextPage = ({ contact }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Box>
            <PageHeaderImg backgroundURL={contact.backgroundURL.url} />
            <PageHeading title="Unsere" underlinedTitle='Öffnungszeiten' description={contact.description} />
            <ContactInformation {...contact} />
        </Box>
    )
};

export default Contact;