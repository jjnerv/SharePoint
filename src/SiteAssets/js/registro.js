async function getChoice(Select){

   return $.ajax({
            url: "https://jjnerd.sharepoint.com/sites/Dino/_api/web/lists/GetByTitle('RegistroDeOcorrencia')/fields?$filter=EntityPropertyName eq '"+ Select +"'",
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: function (data) {
                data.d.results[0].Choices.results;
            },
            error: function (error) {
                alert(JSON.stringify(error));
            }
        });
    }

    function AreasDeReporte(props) {

        const listItems = props.values.map((data, index) =>
            <option key={index.toString()}>
                {data}
            </option>
            );
        return (
        listItems
        );
    }

    function EmpresaDeReporte(props) {

        const listItems = props.values.map((data, index) =>
            <option key={index.toString()}>
                {data}
            </option>
            );
        return (
        listItems
        );
    }

    function Impacto(props) {

        const listItems = props.values.map((data, index) =>
            <option key={index.toString()}>
                {data}
            </option>
            );
        return (
        listItems
        );
    }
 
    function AreaCausadora(props){
        console.log('Areas: ', props);
        const listCausa = props.values.slice(0).reverse().map((data, index) =>
            <tr key={index.toString()}>
                <td colspan="3">
                    <table>
                            <tr>
                                <td valign="top" class="ms-formlabel">
                                    <h3 class="ms-standardheader">
                                        <nobr>AreaCasudora {data}:</nobr>
                                    </h3>
                                    <select required>
                                        <option value=""></option>
                                        <AreasDeReporte values={props.area} />
                                    </select>
                                </td>
                                <td colspan="2" valign="top" class="ms-formlabel">
                                    <h3 class="ms-standardheader">
                                        <nobr>EmpresaCausadora {data}:</nobr>
                                    </h3>
                                    <select required>
                                        <option value=""></option>
                                        <AreasDeReporte values={props.empresa} />
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <h3 class="ms-standardheader">
                                        <nobr>Causa {data}:</nobr>
                                    </h3>
                                    <textarea row="6"></textarea>
                                </td>
                            </tr>
                    </table>
                </td>
            </tr>
        );
        return (
            listCausa
        );        
    }

class Registro extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.addCausa = this.addCausa.bind(this);
      this.fields = {};
      this.fields.AreaDeReporte = React.createRef();
      this.fields.EmpresaDeReporte = React.createRef();
      this.fields.Ocorrencia = React.createRef();
      this.fields.Descricao = React.createRef();
      this.fields.Valor = React.createRef();
      this.fields.Valor0 = React.createRef();
      this.fields.Resultado = React.createRef();
      this.fields.Impacto = React.createRef();
      this.fields.AreasRelacionadas = React.createRef();
      this.fields.ComentariosGerais = React.createRef();
      this.state = {
          Areas: [],
          Empresas: [],
          Impactos: [],
          Causas: [1],
        };
    }

    componentDidMount() {
        const that = this;

        $.when(getChoice('AreaDeReporte'), getChoice('EmpresaDeReporte'), getChoice('Impacto')).done(function(Area, Empresa, Impacto){

            that.setState({
                Areas: Area.d.results[0].Choices.results
            });

            that.setState({
                Empresas: Empresa.d.results[0].Choices.results
            });

            that.setState({
                Impactos: Impacto.d.results[0].Choices.results
            });
        });
    }

    addCausa(event) {
        const that = this;

        console.log('Causa Adicionada: ');

        this.setState((state, props) => ({
            Causas: state.Causas.concat(state.Causas.length + 1)
        }));
 
        event.preventDefault();
    }

    handleSubmit(event) {
        let payload = {};

      for (var key in this.fields) {
        if (this.fields.hasOwnProperty(key)) {
            payload[key] = this.fields[key].current.value;
        }
      }
      console.log('Payload', payload);          
      event.preventDefault();
    }

    render() {
      return (
        <form onSubmit={this.handleSubmit}>       
            <tr>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>AreaDeReporte:</nobr>
                    </h3>
                    <select required ref={this.fields.AreaDeReporte}>
                        <option value=""></option>
                        <AreasDeReporte values={this.state.Areas} />
                    </select>
                </td>
                <td colspan="2" valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>EmpresaDeReporte:</nobr>
                    </h3>
                    <select required ref={this.fields.EmpresaDeReporte} >
                        <option value=""></option>
                        <AreasDeReporte values={this.state.Empresas} />
                    </select>
                </td>
            </tr>
            <tr>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Ocorrencia:</nobr>
                    </h3>
                    <input required type="date" ref={this.fields.Ocorrencia} />
                </td>
            </tr>            
            <tr>
                <td colspan="3" valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Descrição:</nobr>
                    </h3>

                    <textarea required ref={this.fields.Descricao} >
                    </textarea>
                </td>
            </tr>
            <tr>
                <td colspan="3"> <span class="icon_plus" onClick={this.addCausa}>+</span></td>
            </tr>
                <AreaCausadora values={this.state.Causas} area={this.state.Areas} empresa={this.state.Empresas} />
            <tr>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Valor:</nobr>
                    </h3>

                    <input required type="text" ref={this.fields.Valor} />
                </td>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Valor0:</nobr>
                    </h3>

                    <input required type="text" ref={this.fields.Valor0} />
                </td>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Resultado:</nobr>
                    </h3>
                    <input disabled required type="text" ref={this.fields.Resultado} />
                </td>
            </tr>            
            <tr>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Impacto:</nobr>
                    </h3>
                    <select required ref={this.fields.Impacto} >
                        <option value=""></option>
                        <Impacto values={this.state.Impactos} />
                    </select>
                </td>
            </tr> 
            <tr>
                <td colspan="3" valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>AreasRelacionadas:</nobr>
                    </h3>
                    <textarea required ref={this.fields.AreasRelacionadas} >
                    </textarea>
                </td>
            </tr>
            <tr>
                <td colspan="3" valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>ComentariosGerais:</nobr>
                    </h3>
                    <textarea ref={this.fields.ComentariosGerais} >
                    </textarea>
                </td>
            </tr>
            <tr>
                <td>
                    <input type="submit" value="Salvar" />
                </td>
            </tr>
        </form>
      );
    }
  }
  
  ReactDOM.render(
    <Registro />,
    document.getElementById('root')
  );