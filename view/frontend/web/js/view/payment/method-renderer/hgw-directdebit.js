define(
    [
        'jquery',
        'Magento_Checkout/js/view/payment/default',
        'Heidelpay_Gateway/js/action/place-order',
        'Magento_Checkout/js/model/payment/additional-validators'
    ],
    function ($, Component, placeOrderAction, additionalValidators) {
        'use strict';
        return Component.extend({
            defaults: {
                template: 'Heidelpay_Gateway/payment/heidelpay-directdebit-form',
                hgwIban: '',
                hgwOwner: ''
            },
            initObservable: function () {
                this._super()
                    .observe([
                        'hgwIban',
                        'hgwOwner'
                    ]);

                return this;
            },
            getCode: function () {
                return 'hgwdd';
            },
            getData: function () {
                return {
                    'method': this.item.method,
                    'additional_data': {
                        'hgw_iban': this.hgwIban(),
                        'hgw_owner': this.hgwOwner()
                    }
                };
            },

            /**
             * Redirect to hgw controller
             * Override magento placePayment function
             */
            placeOrder: function (data, event) {
                var self = this,
                    placeOrder;

                if (event) {
                    event.preventDefault();
                }

                if (this.validate() && additionalValidators.validate()) {
                    this.isPlaceOrderActionAllowed(false);
                    placeOrder = placeOrderAction(this.getData(), this.redirectAfterPlaceOrder, this.messageContainer);

                    $.when(placeOrder).fail(function () {
                        self.isPlaceOrderActionAllowed(true);
                    }).done(this.afterPlaceOrder.bind(this));
                    return true;
                }
                return false;
            }
        });
    }
);