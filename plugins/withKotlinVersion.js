const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withKotlinVersion(config) {
    return withGradleProperties(config, (config) => {
        // Add or update android.kotlinVersion property
        const kotlinVersionProp = config.modResults.find(
            (item) => item.type === 'property' && item.key === 'android.kotlinVersion'
        );

        if (kotlinVersionProp) {
            kotlinVersionProp.value = '1.9.25';
        } else {
            config.modResults.push({
                type: 'property',
                key: 'android.kotlinVersion',
                value: '1.9.25',
            });
        }

        return config;
    });
};
