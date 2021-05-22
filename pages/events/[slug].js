import axios from "axios";
import { API_URL } from "@/config/index";
import styles from "@/styles/Event.module.css";
import Link from "next/link";
import Image from "next/image";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import EventMap from "@/components/EventMap";

export default function EventPage({ evt }) {
  const router = useRouter();

  return (
    <div className={styles.event}>
      <span>
        {new Date(evt.date).toLocaleDateString("en-US")} at {evt.time}
      </span>
      <h1>{evt.name}</h1>
      <ToastContainer />
      {evt.image && (
        <div className={styles.image}>
          <Image src={evt.image.formats.large.url} width={960} height={600} />
        </div>
      )}
      <h3>Performers:</h3>
      <p>{evt.performers}</p>
      <h3>Description:</h3>
      <p>{evt.description}</p>
      <h3>Venue: {evt.name}</h3>
      <p>{evt.address}</p>

      <EventMap evt={evt} />

      <Link href="/events">
        <a className={styles.back}>{"<"} Go Back</a>
      </Link>
    </div>
  );
}

// export async function getStaticPaths() {
//   const res = await axios.get(`${API_URL}/events`);
//   const events = res.data;
//
//   const paths = events.map((event) => {
//     return {
//       params: { slug: event.slug },
//     };
//   });
//
//   return {
//     paths,
//     fallback: true,
//   };
// }
//
// export async function getStaticProps({ params: { slug } }) {
//   const res = await axios.get(`${API_URL}/events?slug=${slug}`);
//   return {
//     props: {
//       evt: res.data[0],
//     },
//     revalidate: 1,
//   };
// }

export async function getServerSideProps({ query: { slug } }) {
  const res = await axios.get(`${API_URL}/events?slug=${slug}`);
  const events = res.data;

  return {
    props: {
      evt: events[0],
    },
  };
}
