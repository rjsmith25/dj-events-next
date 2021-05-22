import axios from "axios";
import { API_URL } from "@/config/index";
import EventItem from "@/components/EventItem";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import qs from "qs";

export default function SearchPage({ events }) {
  const router = useRouter();
  return (
    <>
      <Link href="/events">Go Back</Link>
      <h1>Search Results for {router.query.term}</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map((evt) => {
        return <EventItem key={evt.id} evt={evt} />;
      })}
    </>
  );
}

export async function getServerSideProps({ query: { term } }) {
  const query = qs.stringify({
    _where: {
      _or: [
        { name_contains: term },
        { performers_contains: term },
        { description_contains: term },
        { venue_contains: term },
      ],
    },
  });
  const res = await axios.get(`${API_URL}/events?${query}`);

  return {
    props: {
      events: res.data,
    },
  };
}
