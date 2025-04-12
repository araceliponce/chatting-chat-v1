import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_SINGLE_USER } from '@/graphql_utils/queries';
import { useAuth } from '@/context/AuthContext';
import { getTimestampFromSeconds } from '@/utils/functions';

export default function UserDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  //no puedes ver los perfiles de otros
  if (id !== user?._id) return <Navigate to='/' />

  const { data, loading, error } = useQuery(QUERY_SINGLE_USER, {
    variables: { id: id },
    skip: !id,
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.user) return <p>No se encontró el usuario</p>;

  const { username, email, loginTimestamp, loginCount } = data.user;

  return (
    <main>
      <section className="section-container px-4 pt-[7rem]">
        <h1 className="text-2xl font-bold">Username: {username}</h1>
        <p className='email'>Email: {email}</p>
        <p>Login count: {loginCount}</p>
        <p>Last login: {getTimestampFromSeconds(loginTimestamp).longDayTimestamp}</p>
      </section>
    </main>
  );
}
