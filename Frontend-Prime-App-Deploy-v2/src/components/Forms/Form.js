import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;
      user.nome.value = onEdit.nome;
      user.email.value = onEdit.email;
      user.fone.value = onEdit.fone;
      user.data_nascimento.value = onEdit.data_nascimento;
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = ref.current;

    if (
      !user.nome.value ||
      !user.email.value ||
      !user.fone.value ||
      !user.data_nascimento.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    if (onEdit) {
      await axios
        .put("/api/" + onEdit.id, {
          nome: user.nome.value,
          email: user.email.value,
          fone: user.fone.value,
          data_nascimento: user.data_nascimento.value,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("https://191.184.72.124:8800", {
          nome: user.nome.value,
          email: user.email.value,
          fone: user.fone.value,
          data_nascimento: user.data_nascimento.value,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    }

    user.nome.value = "";
    user.email.value = "";
    user.fone.value = "";
    user.data_nascimento.value = "";

    setOnEdit(null);
    getUsers();
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
     <InputArea>
        <Label>Nome completo</Label>
        <Input name="nome" />
      </InputArea>
      
      <InputArea>
        <Label>E-mail</Label>
        <Input name="email" type="email" />
      </InputArea>

      <InputArea>
        <Label>Telefone</Label>
        <Input name="fone" type="text" />
      </InputArea>

      <InputArea>
        <Label>CPF</Label>
        <Input name="cpf" type="text" />
      </InputArea>

      <InputArea>
        <Label>RG</Label>
        <Input name="rg" type="text" />
      </InputArea>

      <InputArea>
        <Label>CEP</Label>
        <Input name="CEP" type="text" />
      </InputArea>

      <InputArea>
        <Label>Rua</Label>
        <Input name="rua" type="text" />
      </InputArea>

      <InputArea>
        <Label>Numero</Label>
        <Input name="rua" type="text" />
      </InputArea>

      <InputArea>
        <Label>Cidade</Label>
        <Input name="cidade"type="text" />
      </InputArea>

      <InputArea>
        <Label>Estado</Label>
        <Input name="estado" type="text" />
      </InputArea>

      <InputArea>
        <Label>Estado Civil</Label>
        <Input name="civil" type="text" />
      </InputArea>

      <InputArea>
        <Label>Sexo</Label>
        <Input name="sexo"type="text" />
      </InputArea>

      <InputArea>
        <Label>Dependentes</Label>
        <Input name="dependentes" type="text" />
      </InputArea>

      <InputArea>
        <Label>Data de Nascimento</Label>
        <Input name="data_nascimento" type="date" />
      </InputArea>   

      <Button type="submit">SALVAR</Button>
    </FormContainer>
  );
};

export default Form;
