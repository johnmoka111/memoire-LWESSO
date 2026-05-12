graph TD
    obj1[<u>Utilisateur: Jean</u><br/>role: 'proprietaire'<br/>id: 12]
    obj2[<u>Utilisateur: Marie</u><br/>role: 'acheteur'<br/>id: 45]
    obj3[<u>Propriete: VillaNguba</u><br/>prix: 125000<br/>statut: 'vendu']
    obj4[<u>Transaction: Tx_Escrow_001</u><br/>montant_eth: 15.5<br/>statut: 'finalise']
    obj5[<u>Document: Titre_Propriete.pdf</u><br/>type: 'legal']

    obj1 -- possède --> obj3
    obj3 -- a_pour_historique --> obj4
    obj2 -- est_acheteur_de --> obj4
    obj3 -- contient --> obj5
