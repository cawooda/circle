import { useEffect } from "react";
import ServiceAgreementRow from "../../components/ServiceAgreementRow";
import { QUERY_SERVICE_AGREEMENTS } from "../../utils/queries";
import { useUser } from "../../contexts/UserContext";

export default function ProviderServiceAgreements() {
  const { user, loading, error } = useUser();

  return (
    <div>
      {user?.serviceAgreements?.length > 0 ? (
        user.serviceAgreements.map((agreement, index) => (
          <ServiceAgreementRow
            index={index}
            key={agreement._id}
            agreement={agreement}
            userId={user._id}
          />
        ))
      ) : (
        <p>No agreements found</p>
      )}
    </div>
  );
}
