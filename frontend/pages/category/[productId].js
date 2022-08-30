import React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import Header from "../../components/header";
import { Box } from "@mui/system";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { gql } from "@apollo/client";
import client from "../api/apollo-client";

const useStyles = makeStyles(() => ({
  cardGrid: {
    paddingBottom: useTheme().spacing(8),
    paddingTop: useTheme().spacing(2),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0",
  },
  img: {
    maxWidth: "100%",
    height: "60vh",
  },
}));

const Category = ({ category_data, categories, data }) => {
  const classes = useStyles();
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header data={categories} />
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={2}>
          {data.map((category) => (
            <Link href={`/product/${category.slug}`} key={category.id}>
              <Grid item xs={12} sm={6} md={4}>
                <Card className={classes.card} elevation={0}>
                  <CardMedia
                    className={classes.img}
                    image={category.productImage[0].image}
                    component="img"
                    src={category.productImage[0].image}
                  />
                  <CardContent>
                    <Typography gutterBottom component="p">
                      {category.title}
                    </Typography>
                    <Box component="p" fontSize={16} fontWeight={900}>
                      ${category.regularPrice}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Link>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Category;

export async function getStaticPaths() {
  return {
    paths: [{ params: { productId: "shoes" } }],
    fallback: true,
  };
}

export const getStaticProps = async ({ params }) => {
  const response = await fetch(
    `http://localhost:8000/category/${params.productId}`
  );
  const category_data = await response.json();

  const res = await fetch("http://localhost:8000/categories");
  const categories = await res.json();

  const all_data = gql`
    query ($slug: String!) {
      allCategoriesDetail(slug: $slug) {
        id
        name
        productCategory {
          id
          title
          description
          regularPrice
          productImage {
            image
          }
        }
      }
    }
    query category {
      allCategories {
        id
        name
      }
    }
  `;

  const slug = params.productId;

  const { data } = await client.query({
    query: all_data,
    variables: { slug },
  });

  console.log(data);

  return {
    props: {
      category_data,
      //categories,
      categories: data.allCategories,
      data: data.allCategoriesDetail.productCategory,
    },
  };
};
