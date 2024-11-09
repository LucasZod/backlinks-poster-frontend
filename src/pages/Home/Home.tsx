import React, { useCallback, useEffect, useMemo } from 'react'
import { Input, InputFormik } from '../../components/Input'
import { Modal } from '../../components/Modal'
import { TextAreaFormik } from '../../components/TextArea'
import { Button } from '../../components/Button'
import { FormikProvider, Form as FormFormik, useFormik, useFormikContext } from 'formik'
import { getFilteredCustomers, HomeStore as Store } from './HomeStore'
import { isValid as isValidCpf } from '@fnando/cpf'
import { isValid as isValidCnpj } from '@fnando/cnpj'
import { isValidName } from '../../utils/nameValidator'
import pencilIcon from '../../assets/pencil.svg'
import bookIcon from '../../assets/book.svg'
import { cn } from '../../utils/cn'
import { CustomerDto } from '../../dtos/Customer.dto'
import { CampaignDto } from '../../dtos/Campaign.dto'
import useAuthCheck from '../../utils/useAuthCheck'

const initialValues = { name: '', cpfCnpj: '', backLinks: '', keyWords: '', keyWordsArray: [] }
type InitialValues = typeof initialValues

export const Home = () => {
  useAuthCheck()

  const init = useCallback((dispatch: any) => {
    dispatch(Store.thunks.getCustomers())
  }, [])

  return (
    <Store.Provider init={init}>
      <Container>
        <Layout>
          <Title />
          <Subtitle />
          <SearchInputContainer>
            <SearchInput />
            <CreatedCustomers />
            <CreatedBackLinks />
            <ProvidedBlogs />
            <NewCustomerButton />
          </SearchInputContainer>
          <CustomerTable />
        </Layout>
        <CustomerCreate />
        <PostsHistoryCustomer />
      </Container>
    </Store.Provider>
  )
}

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-ground min-h-dvh p-10">{children}</div>
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full flex flex-col bg-white rounded-md gap-y-2 border border-ground">{children}</div>
}

const Title = () => {
  return <span className="text-2xl text-primary px-4 pt-5">Clientes em postagem automática de backlinks</span>
}

const Subtitle = () => {
  return (
    <span className="text-primary text-sm px-4">
      Nesta seção, acompanhe o status das postagens de backlinks de cada cliente. Visualize rapidamente o nome do
      cliente, quantidade de backlinks planejados e status atual da postagem. Você pode iniciar, pausar ou editar cada
      postagem conforme necessário.
    </span>
  )
}

const SearchInputContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex gap-x-3 items-center pt-5 px-4">{children}</div>
}

const SearchInput = () => {
  const dispatch = Store.useDispatch()
  const { searchInput } = Store.useState()
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(Store.actions.setSearchInput(e.target.value))
  }

  return (
    <Input
      placeholder="Nome do cliente"
      className="w-full h-[3rem]"
      classNameContainer="max-w-[300px] w-full"
      isLabelShrink
      label="Buscar"
      onChange={handleSearch}
      value={searchInput}
    />
  )
}

const InfoTag = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-4 py-1 border border-tag bg-tagGround flex min-w-max rounded-lg border-dashed">{children}</div>
  )
}

const InfoTagTitle = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-tag text-[11px]">{children}</span>
}

const CreatedCustomers = () => {
  const { customers } = Store.useState()
  const totalCustomers = customers?.length ?? 0
  return (
    <InfoTag>
      <InfoTagTitle>{totalCustomers} Clientes criados</InfoTagTitle>
    </InfoTag>
  )
}

const CreatedBackLinks = () => {
  const { customers } = Store.useState()
  const totalBackLinks = customers?.reduce((acc, customer) => acc + customer.backlinks.length, 0) ?? 0
  return (
    <InfoTag>
      <InfoTagTitle>{totalBackLinks} backlinks</InfoTagTitle>
    </InfoTag>
  )
}

const ProvidedBlogs = () => {
  const { customers } = Store.useState()
  const campaign = customers?.reduce<CampaignDto[]>((acc, customer) => [...acc, ...customer.campaigns], [])
  const totalBlogs = campaign?.reduce((acc, campaign) => acc + campaign?.progress, 0) ?? 0
  return (
    <InfoTag>
      <InfoTagTitle>{totalBlogs} Blogs utilizados</InfoTagTitle>
    </InfoTag>
  )
}

const NewCustomerButton = () => {
  const dispatch = Store.useDispatch()
  const { isModalVisible } = Store.useState()
  const handleSetModalVisible = () => {
    dispatch(Store.actions.setIsModalVisible(!isModalVisible))
  }

  return (
    <Button onClick={handleSetModalVisible} className="min-w-max ml-auto">
      NOVO CLIENTE
    </Button>
  )
}

const CustomerTable = () => {
  const filterdCustomers = Store.useSelector(getFilteredCustomers)
  const dispatch = Store.useDispatch()

  const handleEdit = (customer: CustomerDto) => {
    dispatch(Store.actions.setCustomerEdit(customer))
  }

  const handlePostHistory = (customer: CustomerDto) => {
    dispatch(Store.actions.setCustomerHistory(customer))
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Cliente</TableHeadCell>
          <TableHeadCell>CPF/CNPJ</TableHeadCell>
          <TableHeadCell>Status da Postagem</TableHeadCell>
          <TableHeadCell>Qtd Blogs Postados</TableHeadCell>
          <TableHeadCell>Ações</TableHeadCell>
          <TableHeadCell> </TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filterdCustomers?.map((customer) => (
          <TableRow key={customer.id} customer={customer}>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.cpfCnpj}</TableCell>
            <TableCell>
              <StatusTag customer={customer} />
            </TableCell>
            <TableCell>{customer?.campaigns?.reduce((acc, campaign) => acc + campaign.progress, 0) ?? 0}</TableCell>
            <TableCell>
              <ActionButton customer={customer} />
            </TableCell>
            <TableCell className="flex items-center gap-x-4">
              <PostHistory onClick={() => handlePostHistory(customer)} />
              <Edit onClick={() => handleEdit(customer)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const Table = ({ children }: { children: React.ReactNode }) => {
  return <table className="w-full mt-5">{children}</table>
}

const TableHead = ({ children }: { children: React.ReactNode }) => {
  return <thead>{children}</thead>
}

const TableBody = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>
}

const TableRow = ({ children, customer }: { children: React.ReactNode; customer?: CustomerDto }) => {
  const lastItemCampaign = customer?.campaigns?.[0]
  const bgColor = getBgColor(lastItemCampaign?.status)
  return <tr className={cn('border-b border-ground bg-inProgress', bgColor)}>{children}</tr>
}
const getBgColor = (status?: string) => {
  if (!status) return 'bg-white'
  const style = {
    em_andamento: 'bg-inProgress',
  }[status]
  return style ?? 'bg-white'
}

const TableHeadCell = ({ children }: { children: React.ReactNode }) => {
  return <th className="text-start text-primary text-[0.875rem] py-3 px-4">{children}</th>
}

type TableCellProps = React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>
const TableCell = ({ children, ...props }: TableCellProps) => {
  return (
    // eslint-disable-next-line react/prop-types
    <td {...props} className={cn('text-[0.875rem] text-primary py-5 px-4', props.className)}>
      {children}
    </td>
  )
}

const StatusTag = ({ customer }: { customer: CustomerDto }) => {
  const lastItemCampaign = customer?.campaigns?.[0]
  const style = getStyleStatusTag(lastItemCampaign?.status)
  const name = lastItemCampaign?.status ?? 'Não iniciado'
  return <span className={style}>{name.toUpperCase().replace(/_/g, ' ')}</span>
}

const getStyleStatusTag = (status: string) => {
  const style = {
    em_andamento: 'bg-[#EFF8FC] text-primaryBlue rounded-lg p-2',
    pausado: 'bg-[#FFF8E6] text-error rounded-lg p-2',
    concluido: 'bg-[#f0faf3] text-success rounded-lg p-2',
  }[status]

  return style ?? 'bg-[#F9F9F9] text-primary rounded-lg p-2'
}

const ActionButton = ({ customer }: { customer: CustomerDto }) => {
  const lastItemCampaign = customer?.campaigns?.[0]
  const style = getStyleActionButton(lastItemCampaign?.status)
  const name = getActionNameByStatus(lastItemCampaign?.status)
  const dispatch = Store.useDispatch()

  const handleAction = () => {
    dispatch(
      Store.thunks.createCampaign(customer.id, () => {
        dispatch(Store.thunks.getCustomers())
      })
    )
  }

  return (
    <Button onClick={handleAction} className={style}>
      {name}
    </Button>
  )
}

const getStyleActionButton = (status: string) => {
  if (!status) return 'bg-white border border-primary text-primaryBlue w-[5rem]'
  return {
    concluido: 'bg-white border border-primary text-primaryBlue w-[5rem]',
    pausado: 'bg-white border border-success text-success w-[5rem]',
    em_andamento: 'bg-white border border-error text-error w-[5rem]',
  }[status]
}

const getActionNameByStatus = (status: string) => {
  if (!status) return 'INICIAR'
  return {
    concluido: 'INICIAR',
    pausado: 'RETOMAR',
    em_andamento: 'PARAR',
  }[status]
}

type IconButtonProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
const Edit = ({ ...props }: IconButtonProps) => {
  return <img {...props} className="cursor-pointer" src={pencilIcon} alt="Editar" />
}

const PostHistory = ({ ...props }: IconButtonProps) => {
  return <img {...props} src={bookIcon} className="cursor-pointer" alt="Editar" />
}

const CustomerCreate = () => {
  const dispatch = Store.useDispatch()
  const { isModalVisible } = Store.useState()
  const handleSetModalVisible = () => {
    dispatch(Store.actions.setIsModalVisible(false))
  }

  return (
    <Modal isVisible={isModalVisible} onClose={handleSetModalVisible}>
      <Form>
        <Customer>
          <TitleModal />
          <CustomerInfo>
            <CustomerName />
            <CustomerCpfCnpj />
          </CustomerInfo>
          <BackLink />
          <KeyWords />
          <Buttons>
            <SaveButton />
            <CancelButton />
          </Buttons>
        </Customer>
      </Form>
    </Modal>
  )
}

const Form = ({ children }: { children: React.ReactNode }) => {
  const dispatch = Store.useDispatch()
  const { customerEdit } = Store.useState()

  const validate = (values: InitialValues) => {
    const error: Partial<InitialValues> = {}
    if (!values.name) {
      error.name = 'Campo obrigatório'
    }
    if (values.name) {
      if (values.name.length < 3) {
        error.name = 'Nome muito curto'
      }
      if (values.name.length > 100) {
        error.name = 'Nome muito longo'
      }
      if (!isValidName(values.name)) {
        error.name = 'Nome inválido'
      }
    }
    if (!values.cpfCnpj) {
      error.cpfCnpj = 'Campo obrigatório'
    }
    if (values.cpfCnpj && !isValidCpf(values.cpfCnpj) && !isValidCnpj(values.cpfCnpj)) {
      error.cpfCnpj = 'CPF/CNPJ inválido'
    }
    if (!values.backLinks) {
      error.backLinks = 'Campo obrigatório'
    }
    if (values.backLinks) {
      const backLinks = values.backLinks.split('\n')
      for (let i = 0; i < backLinks.length; i++) {
        if (!backLinks[i].startsWith('http://') && !backLinks[i].startsWith('https://')) {
          error.backLinks = 'Informe links válidos'
        }
      }
    }
    if (!values.keyWordsArray.length) {
      error.keyWords = 'Campo obrigatório'
    }
    return error
  }

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (values: InitialValues) => {
      if (customerEdit) {
        dispatch(
          Store.thunks.updateCustomer({
            id: customerEdit.id,
            name: values.name,
            cpfCnpj: values.cpfCnpj,
            backLinks: values.backLinks.split('\n'),
            keyWords: values.keyWordsArray,
            cb: () => {
              dispatch(Store.actions.setIsModalVisible(false))
              dispatch(Store.thunks.getCustomers())
            },
          })
        )
        return
      }
      dispatch(
        Store.thunks.createCustomer({
          name: values.name,
          cpfCnpj: values.cpfCnpj,
          backLinks: values.backLinks.split('\n'),
          keyWords: values.keyWordsArray,
          cb: () => {
            dispatch(Store.actions.setIsModalVisible(false))
            dispatch(Store.thunks.getCustomers())
          },
        })
      )
    },
  })

  useEffect(() => {
    if (!customerEdit) {
      formik.setValues(initialValues)
      formik.resetForm()
      return
    }

    formik.setFieldValue('name', customerEdit.name)
    formik.setFieldValue('cpfCnpj', customerEdit.cpfCnpj)
    formik.setFieldValue('backLinks', customerEdit?.backlinks?.map((backlink) => backlink.url).join('\n'))
    formik.setFieldValue('keyWordsArray', customerEdit?.keyWords ?? [])
  }, [customerEdit])

  return (
    <FormikProvider value={formik}>
      <FormFormik>{children}</FormFormik>
    </FormikProvider>
  )
}

const Customer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-y-6">{children}</div>
}

const TitleModal = () => {
  return <span className="text-primary text-xl">Novo cliente</span>
}

const CustomerInfo = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex gap-4 flex-col md:flex-row">{children}</div>
}

const CustomerName = () => {
  const formik = useFormikContext<InitialValues>()

  useEffect(() => {
    formik.setFieldValue('name', formik.values.name.toUpperCase())
  }, [formik.values.name])

  return (
    <InputFormik
      name="name"
      className="w-full h-[3.5rem]"
      label="Nome *"
      placeholder="Informe o nome"
      isLabelShrink
      onChange={(e) => formik.setFieldTouched('name', true)}
    />
  )
}

const CustomerCpfCnpj = () => {
  const formik = useFormikContext<InitialValues>()
  const mask = useMemo(() => {
    const cleanCpfCnpj = formik.values.cpfCnpj.replace(/\D/g, '')
    return cleanCpfCnpj.length <= 11 ? 'cpf' : 'cnpj'
  }, [formik.values.cpfCnpj])

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasteData = e.clipboardData.getData('Text')
      formik.setFieldValue('cpfCnpj', pasteData)
      e.preventDefault()
    },
    [formik]
  )

  return (
    <InputFormik
      name="cpfCnpj"
      className="w-full h-[3.5rem]"
      label="CPF/CNPJ *"
      placeholder="Informe o CPF ou CNPJ"
      isLabelShrink
      onChange={(e) => formik.setFieldTouched('cpfCnpj', true)}
      onPaste={handlePaste}
      mask={mask}
    />
  )
}

const BackLink = () => {
  const formik = useFormikContext<InitialValues>()

  return (
    <BackLinkContainer>
      <TextAreaFormik
        className="w-full h-[10rem]"
        label="Backlinks"
        placeholder="Informe ou cole os backlinks aqui..."
        isLabelShrink
        name="backLinks"
        onChange={(e) => formik.setFieldTouched('backLinks', true)}
      />
      <BackLinkCounter />
    </BackLinkContainer>
  )
}

const BackLinkContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-y-1">{children}</div>
}

const BackLinkCounter = () => {
  const formik = useFormikContext<InitialValues>()
  const backLinks = formik.values.backLinks
    .split('\n')
    .filter((link) => link.startsWith('http://') || link.startsWith('https://'))
  return <span className="text-primary text-sm">{backLinks.length} backlinks</span>
}

const PostsHistoryCustomer = () => {
  const { customerHistory } = Store.useState()
  const dispatch = Store.useDispatch()

  const handleSetModalVisible = () => {
    dispatch(Store.actions.setCustomerHistory(null))
  }

  return (
    <Modal isVisible={!!customerHistory} onClose={handleSetModalVisible} width={400}>
      <PostsHistoryContainer>
        <TitlePostsHistory />
        <CustomerNamePostsHistory />
        <TablePostsHistory />
        <ButtonPostsHistory />
      </PostsHistoryContainer>
    </Modal>
  )
}

const PostsHistoryContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-y-6">{children}</div>
}

const TitlePostsHistory = () => {
  return <span className="text-primary text-2xl">Histórico de postagem</span>
}

const CustomerNamePostsHistory = () => {
  const { customerHistory } = Store.useState()
  return (
    <div className="flex flex-col gap-y-1">
      <span className="text-xs text-primary">Cliente</span>
      <span className="text-primary text-lg">{customerHistory?.name}</span>
    </div>
  )
}

const TablePostsHistory = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Data</TableHeadCell>
          <TableHeadCell>Qtd Blogs Postados</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>12/09/2021</TableCell>
          <TableCell>95/100</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>11/09/2021</TableCell>
          <TableCell>100/100</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>10/09/2021</TableCell>
          <TableCell>44/100</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

const ButtonPostsHistory = () => {
  const dispatch = Store.useDispatch()
  const handleSetHistoryModalVisible = () => {
    dispatch(Store.actions.setCustomerHistory(null))
  }
  return (
    <Button onClick={handleSetHistoryModalVisible} className="bg-white text-primaryBlue border border-ground">
      Fechar
    </Button>
  )
}

const KeyWords = () => {
  const formik = useFormikContext<InitialValues>()

  const handleSetKeyWordsArray = () => {
    const { keyWords, keyWordsArray } = formik.values
    if (!keyWords) return
    const newKeyWordsArray = keyWords.split(',').map((keyWord) => keyWord.trim())
    formik.setFieldValue('keyWordsArray', [...keyWordsArray, ...newKeyWordsArray])
    formik.setFieldValue('keyWords', '')
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSetKeyWordsArray()
    }
  }

  useEffect(() => {
    formik.setFieldValue('keyWords', formik.values.keyWords.toUpperCase())
  }, [formik.values.keyWords])

  return (
    <ContainerKeyWords>
      <KeyWordsTagsContainer>
        {formik.values.keyWordsArray.map((keyWord, index) => (
          <TagKeyWords key={index} keyWord={keyWord} index={index} />
        ))}
      </KeyWordsTagsContainer>
      <TextAreaFormik
        className="w-full h-[5rem]"
        label="Palavras-chave"
        placeholder="Informe as palavras-chave aqui..."
        isLabelShrink
        name="keyWords"
        onKeyDown={handleOnKeyDown}
      />
      <ButtonKeyWords onClick={handleSetKeyWordsArray} />
    </ContainerKeyWords>
  )
}

const ContainerKeyWords = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col">{children}</div>
}

type ButtonKeyWordsProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
const ButtonKeyWords = ({ ...props }: ButtonKeyWordsProps) => {
  return (
    <Button {...props} type="button" className="text-primary bg-white border border-primary text-sm -mt-1">
      Atribuir palavras chaves
    </Button>
  )
}

const KeyWordsTagsContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex gap-2 flex-wrap mb-5">{children}</div>
}

const TagKeyWords = ({ keyWord, index }: { keyWord: string; index: number }) => {
  const formik = useFormikContext<InitialValues>()

  const handleRemoveKeyWord = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    const keyWordsArray = formik.values.keyWordsArray.filter((_, i) => i !== index)
    formik.setFieldValue('keyWordsArray', keyWordsArray)
  }

  const handleEditKeyWord = () => {
    const keyWordsArray = formik.values.keyWordsArray.filter((_, i) => i !== index)
    formik.setFieldValue('keyWordsArray', keyWordsArray)
    formik.setFieldValue('keyWords', keyWord)
  }

  return (
    <div
      onClick={handleEditKeyWord}
      className="bg-tagGround relative rounded-lg py-2 px-3 border-dashed border border-tag break-all cursor-pointer hover:brightness-50"
    >
      <span
        onClick={handleRemoveKeyWord}
        className="p-1 rounded-full text-tag text-sm font-semibold absolute -top-[7px] -right-[1px] cursor-pointer"
      >
        x
      </span>
      <span className="text-tag text-sm">{keyWord}</span>
    </div>
  )
}

const Buttons = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-x-3">{children}</div>
}

const SaveButton = () => {
  return (
    <Button type="submit" className="text-white">
      SALVAR
    </Button>
  )
}

const CancelButton = () => {
  const dispatch = Store.useDispatch()
  const handleSetModalVisible = () => {
    dispatch(Store.actions.setIsModalVisible(false))
  }

  return (
    <Button onClick={handleSetModalVisible} className="text-primaryBlue bg-white border border-ground">
      CANCELAR
    </Button>
  )
}
