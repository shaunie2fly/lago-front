import { gql } from '@apollo/client'
import styled from 'styled-components'

import { Typography, Button, Skeleton } from '~/components/designSystem'
import { useInternationalization } from '~/hooks/core/useInternationalization'
import { theme } from '~/styles'
import { SectionHeader } from '~/styles/customer'
import { CustomerMainInfosFragment, ProviderTypeEnum } from '~/generated/graphql'
import CountryCodes from '~/public/countryCode.json'

gql`
  fragment CustomerMainInfos on CustomerDetails {
    id
    name
    externalId
    canBeDeleted
    legalName
    legalNumber
    phone
    email
    logoUrl
    url
    addressLine1
    addressLine2
    state
    country
    city
    zipcode
    paymentProvider
    stripeCustomer {
      id
      providerCustomerId
    }
  }
`

interface CustomerMainInfosProps {
  loading?: boolean
  customer?: CustomerMainInfosFragment | null
  onEdit?: () => unknown
}

const formatUrl: (url: string) => string = (url) => {
  if (url.length < 16) return url

  return url.slice(0, 10) + '...' + url.slice(-6)
}

export const CustomerMainInfos = ({ loading, customer, onEdit }: CustomerMainInfosProps) => {
  const { translate } = useInternationalization()

  if (loading || !customer)
    return (
      <LoadingDetails>
        <SectionHeader variant="subhead">
          <Skeleton variant="text" height={12} width={200} />
        </SectionHeader>
        <div>
          <Skeleton variant="text" height={12} width={80} marginBottom={theme.spacing(3)} />
          <Skeleton variant="text" height={12} width={200} />
        </div>
        <div>
          <Skeleton variant="text" height={12} width={80} marginBottom={theme.spacing(3)} />
          <Skeleton variant="text" height={12} width={200} />
        </div>
      </LoadingDetails>
    )

  const {
    name,
    externalId,
    legalName,
    legalNumber,
    phone,
    email,
    logoUrl,
    url,
    addressLine1,
    addressLine2,
    state,
    country,
    city,
    zipcode,
    paymentProvider,
    stripeCustomer,
  } = customer

  return (
    <DetailsBlock>
      <SectionHeader variant="subhead">
        {translate('text_6250304370f0f700a8fdc27d')}

        <Button variant="quaternary" onClick={onEdit}>
          {translate('text_626162c62f790600f850b75a')}
        </Button>
      </SectionHeader>

      {name && (
        <div>
          <Typography variant="caption">{translate('text_626162c62f790600f850b76a')}</Typography>
          <Typography color="textSecondary">{name}</Typography>
        </div>
      )}
      <div>
        <Typography variant="caption">{translate('text_6250304370f0f700a8fdc283')}</Typography>
        <Typography color="textSecondary">{externalId}</Typography>
      </div>
      {legalName && (
        <div>
          <Typography variant="caption">{translate('text_626c0c301a16a600ea061471')}</Typography>
          <Typography color="textSecondary">{legalName}</Typography>
        </div>
      )}
      {legalNumber && (
        <div>
          <Typography variant="caption">{translate('text_626c0c301a16a600ea061475')}</Typography>
          <Typography color="textSecondary">{legalNumber}</Typography>
        </div>
      )}
      {email && (
        <div>
          <Typography variant="caption">{translate('text_626c0c301a16a600ea061479')}</Typography>
          <Typography color="textSecondary">{email}</Typography>
        </div>
      )}
      {phone && (
        <div>
          <Typography variant="caption">{translate('text_626c0c301a16a600ea06147d')}</Typography>
          <Typography color="textSecondary">{phone}</Typography>
        </div>
      )}
      {url && (
        <div>
          <Typography variant="caption">{translate('text_626c0c301a16a600ea061481')}</Typography>
          <Typography>
            <a href={url}>{formatUrl(url)}</a>
          </Typography>
        </div>
      )}
      {logoUrl && (
        <div>
          <Typography variant="caption">{translate('text_626c0c301a16a600ea061485')}</Typography>
          <Typography>
            <a href={logoUrl}>{formatUrl(logoUrl)}</a>
          </Typography>
        </div>
      )}
      {(addressLine1 || addressLine2 || state || country || city || zipcode) && (
        <div>
          <Typography variant="caption">{translate('text_626c0c301a16a600ea06148d')}</Typography>
          <Typography color="textSecondary">{addressLine1}</Typography>
          <Typography color="textSecondary">{addressLine2}</Typography>
          <Typography color="textSecondary">
            {zipcode} {city} {state}
          </Typography>
          {country && <Typography color="textSecondary">{CountryCodes[country]}</Typography>}
        </div>
      )}
      {paymentProvider === ProviderTypeEnum?.Stripe && (
        <div>
          <Typography variant="caption">{translate('text_62b5c912506c4905fa755248')}</Typography>
          <Typography color="textSecondary">
            {translate('text_62b5c912506c4905fa75524a')}
          </Typography>
        </div>
      )}
      {!!stripeCustomer && !!stripeCustomer?.providerCustomerId && (
        <div>
          <Typography variant="caption">{translate('text_62b5c912506c4905fa75524c')}</Typography>
          <Typography color="textSecondary">{stripeCustomer?.providerCustomerId}</Typography>
        </div>
      )}
    </DetailsBlock>
  )
}

const LoadingDetails = styled.div`
  > *:first-child {
    margin-bottom: ${theme.spacing(7)};
  }

  > *:not(:first-child) {
    margin-bottom: ${theme.spacing(7)};
  }
`

const DetailsBlock = styled.div`
  > *:first-child {
    margin-bottom: ${theme.spacing(6)};
  }

  > *:not(:first-child) {
    margin-bottom: ${theme.spacing(4)};
  }
`
