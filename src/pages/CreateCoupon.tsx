import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useCreateEditCoupon } from '~/hooks/useCreateEditCoupon'
import { theme, PageHeader, Card } from '~/styles'
import { useInternationalization } from '~/hooks/core/useInternationalization'
import { Typography, Button, ButtonLink } from '~/components/designSystem'
import { WarningDialog, WarningDialogRef } from '~/components/WarningDialog'
import SuccessImage from '~/public/images/maneki/success.svg'
import { COUPONS_ROUTE } from '~/core/router'
import { CouponForm } from '~/components/coupons/CouponForm'

const CreateCoupon = () => {
  const { translate } = useInternationalization()
  let navigate = useNavigate()
  const { isEdition, loading, coupon, isCreated, resetIsCreated, onSave } = useCreateEditCoupon()
  const warningDialogRef = useRef<WarningDialogRef>(null)

  return (
    <div>
      <PageHeader>
        <Typography variant="bodyHl" color="textSecondary" noWrap>
          {translate(isEdition ? 'text_6287a9bdac160c00b2e0fbe7' : 'text_62876e85e32e0300e18030e7')}
        </Typography>
        <Button
          variant="quaternary"
          icon="close"
          onClick={() =>
            isCreated ? navigate(COUPONS_ROUTE) : warningDialogRef.current?.openDialog()
          }
        />
      </PageHeader>
      {isCreated ? (
        <SuccessCard $disableChildSpacing>
          <SuccessImage width="136" height="104" />
          <SuccessTitle variant="subhead">
            {translate('text_62876e85e32e0300e18030f3')}
          </SuccessTitle>
          <SuccessDescription>{translate('text_62876e85e32e0300e18030fa')}</SuccessDescription>
          <div>
            <Button variant="secondary" onClick={resetIsCreated}>
              {translate('text_62876e85e32e0300e1803102')}
            </Button>
            <ButtonLink type="button" to={COUPONS_ROUTE} buttonProps={{ variant: 'secondary' }}>
              {translate('text_62876e85e32e0300e180310a')}
            </ButtonLink>
          </div>
        </SuccessCard>
      ) : (
        <CouponForm loading={loading} coupon={coupon} onSave={onSave} isEdition={isEdition} />
      )}
      <WarningDialog
        ref={warningDialogRef}
        title={translate(
          isEdition ? 'text_6287a9bdac160c00b2e0fbeb' : 'text_62876e85e32e0300e18030f5'
        )}
        description={translate(
          isEdition ? 'text_6287a9bdac160c00b2e0fbf1' : 'text_62876e85e32e0300e18030fc'
        )}
        continueText={translate(
          isEdition ? 'text_6287a9bdac160c00b2e0fbfd' : 'text_62876e85e32e0300e180310b'
        )}
        onContinue={() => navigate(COUPONS_ROUTE)}
      />
    </div>
  )
}

const SuccessCard = styled(Card)`
  max-width: 672px;
  margin: ${theme.spacing(12)} auto 0;

  > img {
    width: 40px;
    height: 40px;
    margin-bottom: ${theme.spacing(5)};
  }

  > *:last-child {
    display: flex;
    > *:first-child {
      margin-right: ${theme.spacing(3)};
    }
  }
`

const SuccessTitle = styled(Typography)`
  margin-bottom: ${theme.spacing(3)};
`

const SuccessDescription = styled(Typography)`
  margin-bottom: ${theme.spacing(5)};
`

export default CreateCoupon
